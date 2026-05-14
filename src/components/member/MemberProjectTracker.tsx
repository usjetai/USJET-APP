import { FolderKanban, Minus, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import { fleetManifest } from "../../data/fleetManifest";
import {
  addFleetUnitToProject,
  createMemberProject,
  deleteMemberProject,
  incrementProjectFleetUsage,
  readMemberProjects,
  removeFleetUnitFromProject,
  subscribeMemberProjects,
  updateProjectJobDescription,
  type MemberProject,
} from "../../lib/memberProjectTracker";

const fleetUnits = [...fleetManifest].sort((a, b) => a.slot - b.slot);

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

  return (
    <GlassEffectContainer className="member-projects glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
      <div className="member-projects__header">
        <p className="member-projects__kicker">Mission control</p>
        <h2 className="member-projects__title">Mission Projects</h2>
        <p className="member-projects__copy">
          Track which fleet units power each mission — job role and usage per project.
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
                onClick={() => setActiveProjectId(project.id)}
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
            <li key={assignment.unitId} className="member-projects__assignment">
              <div className="member-projects__assignment-head">
                <div>
                  <p className="member-projects__callsign">{assignment.callsign}</p>
                  <p className="member-projects__unit-name">{assignment.name}</p>
                </div>
                <div className="member-projects__usage">
                  <span className="member-projects__usage-label">Uses</span>
                  <span className="member-projects__usage-count">{assignment.usageCount}</span>
                  <button
                    type="button"
                    className="member-projects__usage-btn glass-effect-interactive"
                    aria-label={`Log use for ${assignment.callsign}`}
                    onClick={() =>
                      incrementProjectFleetUsage(customerId, project.id, assignment.unitId)
                    }
                  >
                    <Plus size={12} aria-hidden />
                  </button>
                </div>
              </div>

              <label className="member-projects__field">
                <span className="member-projects__field-label">Job on this project</span>
                <input
                  className="member-projects__input"
                  type="text"
                  value={assignment.jobDescription}
                  onChange={(event) =>
                    updateProjectJobDescription(
                      customerId,
                      project.id,
                      assignment.unitId,
                      event.target.value,
                    )
                  }
                  placeholder='e.g. "writing contracts", "research"'
                  maxLength={120}
                />
              </label>

              <button
                type="button"
                className="member-projects__remove glass-effect-interactive"
                onClick={() => removeFleetUnitFromProject(customerId, project.id, assignment.unitId)}
              >
                <Minus size={12} aria-hidden />
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
