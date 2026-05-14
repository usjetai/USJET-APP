import { FolderKanban, Minus, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type FormEvent } from "react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import { fleetBayAccentStyle } from "../../data/fleetBayAccents";
import { fleetManifest } from "../../data/fleetManifest";
import { MEMBER_ASSIGNMENT_HOLD_MESSAGE } from "../../lib/usjetContact";
import {
  addFleetUnitToProject,
  createMemberProject,
  deleteMemberProject,
  readMemberProjects,
  removeFleetUnitFromProject,
  saveProjectAssignment,
  setMemberActiveProject,
  subscribeMemberProjects,
  type MemberProject,
  type ProjectFleetAssignment,
} from "../../lib/memberProjectTracker";

const fleetUnits = [...fleetManifest].sort((a, b) => a.slot - b.slot);
const HOLD_MESSAGE_MS = 6000;

type MemberProjectTrackerProps = {
  customerId: string;
};

export default function MemberProjectTracker({ customerId }: MemberProjectTrackerProps) {
  const [tick, setTick] = useState(0);
  const [projectName, setProjectName] = useState("");
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [pickerUnitId, setPickerUnitId] = useState("");

  useEffect(() => subscribeMemberProjects(() => setTick((value) => value + 1)), []);

  const projects = useMemo(() => readMemberProjects(customerId), [customerId, tick]);
  const activeProject = projects.find((project) => project.id === activeProjectId) ?? projects[0] ?? null;

  useEffect(() => {
    if (projects.length === 0) {
      setActiveProjectId(null);
      return;
    }
    if (!activeProjectId || !projects.some((project) => project.id === activeProjectId)) {
      setActiveProjectId(projects[0].id);
    }
  }, [projects, activeProjectId]);

  useEffect(() => {
    if (activeProject) {
      setMemberActiveProject(customerId, activeProject.id);
    }
  }, [customerId, activeProject?.id]);

  const availableUnits = useMemo(() => {
    if (!activeProject) {
      return fleetUnits;
    }
    const assigned = new Set(activeProject.assignments.map((assignment) => assignment.unitId));
    return fleetUnits.filter((unit) => !assigned.has(unit.id));
  }, [activeProject]);

  const handleCreate = (event: FormEvent) => {
    event.preventDefault();
    const created = createMemberProject(customerId, projectName);
    if (created) {
      setProjectName("");
      setActiveProjectId(created.id);
    }
  };

  const handleAddUnit = () => {
    if (!activeProject || !pickerUnitId) {
      return;
    }
    const unit = fleetUnits.find((entry) => entry.id === pickerUnitId);
    if (!unit) {
      return;
    }
    addFleetUnitToProject(customerId, activeProject.id, unit);
    setPickerUnitId("");
  };

  const handleSelectProject = (projectId: string) => {
    setActiveProjectId(projectId);
    setMemberActiveProject(customerId, projectId);
  };

  return (
    <GlassEffectContainer className="member-projects glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
      <div className="member-projects__header">
        <p className="member-projects__kicker">Mission control</p>
        <h2 className="member-projects__title">Mission Projects</h2>
        <p className="member-projects__copy">
          Assign fleet units per mission, save each role, and track session forks when you launch from
          Hangar or Intel.
        </p>
      </div>

      <form className="member-projects__create" onSubmit={handleCreate}>
        <label className="member-projects__field">
          <span className="member-projects__field-label">Project name</span>
          <input
            className="member-projects__input"
            type="text"
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            placeholder="e.g. Q2 contract pipeline"
            maxLength={80}
          />
        </label>
        <button type="submit" className="member-projects__create-btn glass-effect-interactive">
          <Plus size={14} aria-hidden />
          Create
        </button>
      </form>

      {projects.length === 0 ? (
        <p className="member-projects__empty">Create your first project</p>
      ) : (
        <div className="member-projects__workspace">
          <div className="member-projects__tabs" role="tablist" aria-label="Mission projects">
            {projects.map((project) => (
              <button
                key={project.id}
                type="button"
                role="tab"
                aria-selected={activeProject?.id === project.id}
                className={[
                  "member-projects__tab glass-effect-interactive",
                  activeProject?.id === project.id ? "member-projects__tab--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => handleSelectProject(project.id)}
              >
                {project.name}
              </button>
            ))}
          </div>

          {activeProject ? (
            <ProjectWorkspace
              customerId={customerId}
              project={activeProject}
              availableUnits={availableUnits}
              pickerUnitId={pickerUnitId}
              onPickerChange={setPickerUnitId}
              onAddUnit={handleAddUnit}
            />
          ) : null}
        </div>
      )}
    </GlassEffectContainer>
  );
}

type ProjectWorkspaceProps = {
  customerId: string;
  project: MemberProject;
  availableUnits: typeof fleetUnits;
  pickerUnitId: string;
  onPickerChange: (value: string) => void;
  onAddUnit: () => void;
};

function ProjectWorkspace({
  customerId,
  project,
  availableUnits,
  pickerUnitId,
  onPickerChange,
  onAddUnit,
}: ProjectWorkspaceProps) {
  return (
    <div className="member-projects__panel" role="tabpanel">
      <div className="member-projects__panel-head">
        <div className="member-projects__panel-title-row">
          <FolderKanban size={16} aria-hidden className="member-projects__panel-icon" />
          <h3 className="member-projects__panel-title">{project.name}</h3>
        </div>
        <button
          type="button"
          className="member-projects__delete glass-effect-interactive"
          onClick={() => deleteMemberProject(customerId, project.id)}
        >
          <Trash2 size={13} aria-hidden />
          Delete project
        </button>
      </div>

      <div className="member-projects__assign">
        <label className="member-projects__field member-projects__field--inline">
          <span className="member-projects__field-label">Add fleet unit</span>
          <select
            className="member-projects__select"
            value={pickerUnitId}
            onChange={(event) => onPickerChange(event.target.value)}
            disabled={availableUnits.length === 0}
          >
            <option value="">
              {availableUnits.length === 0 ? "All 30 units assigned" : "Select callsign…"}
            </option>
            {availableUnits.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.callsign} — {unit.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="member-projects__add-btn glass-effect-interactive"
          onClick={onAddUnit}
          disabled={!pickerUnitId}
        >
          <Plus size={14} aria-hidden />
          Add
        </button>
      </div>

      {project.assignments.length === 0 ? (
        <p className="member-projects__panel-empty">Assign fleet units to this project.</p>
      ) : (
        <ul className="member-projects__assignments">
          {project.assignments.map((assignment) => (
            <AssignmentRow
              key={assignment.unitId}
              customerId={customerId}
              projectId={project.id}
              assignment={assignment}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function SessionForksBadge({ count }: { count: number }) {
  const tooltipId = useId();

  return (
    <div className="member-projects__forks-badge-wrap">
      <button
        type="button"
        className="member-projects__forks-count glass-effect-interactive"
        aria-describedby={tooltipId}
        aria-label={`${count} session forks`}
      >
        {count}
      </button>
      <GlassEffectContainer
        className="member-projects__forks-tooltip glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan"
      >
        <div id={tooltipId} role="tooltip" className="member-projects__forks-tooltip-body">
          <p className="member-projects__forks-tooltip-lead">
            One window. One thread. Your project stays intact.
          </p>
          <p className="member-projects__forks-tooltip-copy">
            Each new browser launch starts this unit&apos;s work from a clean slate — the AI does not
            carry context from another tab or window.
          </p>
          <p className="member-projects__forks-tooltip-copy">
            Design, drafts, and decisions from your last session are not waiting in a fresh launch.
            Keep one subject in one session; opening many browsers splits the mission and your
            project drifts.
          </p>
          <p className="member-projects__forks-tooltip-copy member-projects__forks-tooltip-copy--muted">
            Extra windows also strain memory — continuity is what protects the work you&apos;ve already
            built.
          </p>
        </div>
      </GlassEffectContainer>
    </div>
  );
}

type AssignmentRowProps = {
  customerId: string;
  projectId: string;
  assignment: ProjectFleetAssignment;
};

function AssignmentRow({ customerId, projectId, assignment }: AssignmentRowProps) {
  const [draftJob, setDraftJob] = useState(assignment.jobDescription);
  const [holdVisible, setHoldVisible] = useState(false);
  const holdTimerRef = useRef<number | null>(null);
  const unitSlot = fleetUnits.find((unit) => unit.id === assignment.unitId)?.slot;
  const accentStyle = typeof unitSlot === "number" ? fleetBayAccentStyle(unitSlot) : undefined;

  useEffect(() => {
    setDraftJob(assignment.jobDescription);
  }, [assignment.jobDescription, assignment.unitId]);

  useEffect(
    () => () => {
      if (holdTimerRef.current !== null) {
        window.clearTimeout(holdTimerRef.current);
      }
    },
    [],
  );

  const handleSave = () => {
    saveProjectAssignment(customerId, projectId, assignment.unitId, draftJob);
    setHoldVisible(true);
    if (holdTimerRef.current !== null) {
      window.clearTimeout(holdTimerRef.current);
    }
    holdTimerRef.current = window.setTimeout(() => {
      setHoldVisible(false);
      holdTimerRef.current = null;
    }, HOLD_MESSAGE_MS);
  };

  const dirty = draftJob !== assignment.jobDescription;
  const parallelSessions = assignment.sessionForks > 1;

  return (
    <li
      className="member-projects__assignment member-projects__assignment--bay-accent"
      style={accentStyle as CSSProperties | undefined}
    >
      <div className="member-projects__assignment-head">
        <div>
          <p className="member-projects__callsign">{assignment.callsign}</p>
          <p className="member-projects__unit-name">{assignment.name}</p>
        </div>
        <div className="member-projects__forks">
          <span className="member-projects__forks-label">Session forks</span>
          <SessionForksBadge count={assignment.sessionForks} />
        </div>
      </div>

      <p className="member-projects__forks-hint">
        Each launch from Hangar or Intel opens a new thread for this project.
      </p>

      {parallelSessions ? (
        <p className="member-projects__forks-coach" role="note">
          {assignment.sessionForks} parallel sessions — keep one cockpit open per unit so the mission
          stays on one subject.
        </p>
      ) : null}

      <label className="member-projects__field">
        <span className="member-projects__field-label">Job on this project</span>
        <input
          className="member-projects__input"
          type="text"
          value={draftJob}
          onChange={(event) => setDraftJob(event.target.value)}
          placeholder='e.g. "writing contracts", "research"'
          maxLength={120}
        />
      </label>

      <div className="member-projects__assignment-actions">
        <button
          type="button"
          className="member-projects__save-btn btn-glass glass-effect glass-effect-interactive"
          onClick={handleSave}
        >
          <Save size={13} aria-hidden />
          Save assignment
        </button>

        <button
          type="button"
          className="member-projects__remove glass-effect-interactive"
          onClick={() => removeFleetUnitFromProject(customerId, projectId, assignment.unitId)}
        >
          <Minus size={12} aria-hidden />
          Remove
        </button>
      </div>

      {holdVisible ? (
        <p className="member-projects__hold" role="status" aria-live="polite">
          {MEMBER_ASSIGNMENT_HOLD_MESSAGE}
        </p>
      ) : null}
    </li>
  );
}
