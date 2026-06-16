import { ChevronDown, FolderKanban, Minus, Pencil, Plus, Save, Timer, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { useLocation } from "react-router-dom";
import DeveloperRedBlinkName, {
  getVisibleDeveloperName,
  highlightDeveloperCoPilotName,
} from "../DeveloperRedBlinkName";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import { useMemberPortalUsageTimer } from "../../hooks/useMemberPortalUsageTimer";
import { fleetBayAccentStyle } from "../../data/fleetBayAccents";
import { fleetManifest } from "../../data/fleetManifest";
import { MEMBER_ASSIGNMENT_HOLD_MESSAGE } from "../../lib/usjetContact";
import { useMemberAuth } from "../../context/MemberAuthContext";
import { computeFreeTierUsage } from "../../lib/memberPortalTelemetry";
import {
  addFleetUnitToProject,
  createMemberProject,
  deleteMemberProject,
  readMemberProjects,
  readSavedMissionRecords,
  removeFleetUnitFromProject,
  formatPortalUsageDuration,
  formatPortalUsageTimestamp,
  saveProjectAssignment,
  setMemberActiveProject,
  setMemberProjectTimeAttributionUnit,
  subscribeMemberProjects,
  unlockProjectAssignment,
  type MemberProject,
  type PortalUsageSession,
  type ProjectFleetAssignment,
  type SavedMissionRecord,
} from "../../lib/memberProjectTracker";

const fleetUnits = [...fleetManifest].sort((a, b) => a.slot - b.slot);
const HOLD_MESSAGE_MS = 6000;
const SAVE_FLASH_MS = 2400;
const USAGE_SESSION_UI_CAP = 10;

function formatSavedTimestamp(iso: string): string {
  if (!iso) {
    return "—";
  }
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

const SESSION_FORKS_DISCIPLINE =
  "Parallel browser sessions fragment your project. Without discipline, you burn RAM, lose continuity, and start over. USJET tracks session forks so you operate like a professional—not a clone factory.";

const PORTAL_USAGE_REALITY =
  "Active time is measured on this device while the Member Portal tab is visible and focused. It reflects engagement inside USJET—not OpenRouter token totals, model-provider billing, or Stripe metered overage. For charges and quotas, use your Stripe dashboard.";

type MemberProjectTrackerProps = {
  customerId: string;
};

export default function MemberProjectTracker({ customerId }: MemberProjectTrackerProps) {
  const location = useLocation();
  const [tick, setTick] = useState(0);
  const [projectName, setProjectName] = useState("");
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [pickerUnitId, setPickerUnitId] = useState("");
  const [usageDetailUnitId, setUsageDetailUnitId] = useState<string | null>(null);

  useEffect(() => subscribeMemberProjects(() => setTick((value) => value + 1)), []);

  const projects = useMemo(() => readMemberProjects(customerId), [customerId, tick]);
  const savedRecords = useMemo(() => readSavedMissionRecords(customerId), [customerId, tick]);
  const activeProject = projects.find((project) => project.id === activeProjectId) ?? projects[0] ?? null;
  const assignmentUnitIdsKey = useMemo(
    () => (activeProject?.assignments ?? []).map((a) => a.unitId).join(","),
    [activeProject],
  );

  useMemberPortalUsageTimer({
    customerId,
    projectId: activeProject?.id ?? null,
    pathname: location.pathname,
    lastTimeTrackedUnitId: activeProject?.lastTimeTrackedUnitId ?? null,
    assignmentUnitIdsKey,
  });
  const activeProjectHasSaves = Boolean(
    activeProject?.assignments.some((assignment) => assignment.isSaved),
  );

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

  useEffect(() => {
    setUsageDetailUnitId(null);
  }, [activeProject?.id]);

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
    <GlassEffectContainer
      className={[
        "member-projects glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan",
        savedRecords.length > 0 ? "member-projects--has-saves" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="member-projects__header">
        <p className="member-projects__kicker">Mission control</p>
        <h2 className="member-projects__title">Mission Projects</h2>
        <p className="member-projects__copy">
          Name each Co-Pilot, record your search intent, save the assignment. Misuse burns equipment and
          wastes work—operate with discipline.
        </p>
        <p className="member-projects__usage-reality">{PORTAL_USAGE_REALITY}</p>
      </div>

      {savedRecords.length > 0 ? (
        <SavedRecordsPanel records={savedRecords} onSelectProject={handleSelectProject} />
      ) : null}

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
                  project.assignments.some((assignment) => assignment.isSaved)
                    ? "member-projects__tab--has-saves"
                    : "",
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
              hasSavedAssignments={activeProjectHasSaves}
              availableUnits={availableUnits}
              pickerUnitId={pickerUnitId}
              onPickerChange={setPickerUnitId}
              onAddUnit={handleAddUnit}
              usageDetailUnitId={usageDetailUnitId}
              onUsageDetailUnitIdChange={setUsageDetailUnitId}
            />
          ) : null}
        </div>
      )}
    </GlassEffectContainer>
  );
}

type SavedRecordsPanelProps = {
  records: SavedMissionRecord[];
  onSelectProject: (projectId: string) => void;
};

function SavedRecordsPanel({ records, onSelectProject }: SavedRecordsPanelProps) {
  return (
    <section className="member-projects__saved-log" aria-label="Saved mission records">
      <div className="member-projects__saved-log-head">
        <p className="member-projects__saved-log-kicker">Your account</p>
        <h3 className="member-projects__saved-log-title">Saved mission log</h3>
        <p className="member-projects__saved-log-copy">
          {records.length} saved assignment{records.length === 1 ? "" : "s"} on this device — retrievable
          after refresh while you stay signed in.
        </p>
      </div>
      <ul className="member-projects__saved-log-list">
        {records.map((record) => (
          <li key={`${record.projectId}-${record.assignment.unitId}`} className="member-projects__saved-log-item">
            <button
              type="button"
              className="member-projects__saved-log-link glass-effect-interactive"
              onClick={() => onSelectProject(record.projectId)}
            >
              <span className="member-projects__saved-log-project">{record.projectName}</span>
              <span className="member-projects__saved-log-unit">
                {record.assignment.name} — <DeveloperRedBlinkName name={record.assignment.name} />
              </span>
              <span className="member-projects__saved-log-intent">{record.assignment.searchIntent}</span>
              <time className="member-projects__saved-log-time" dateTime={record.assignment.savedAt}>
                {formatSavedTimestamp(record.assignment.savedAt)}
              </time>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

type ProjectWorkspaceProps = {
  customerId: string;
  project: MemberProject;
  hasSavedAssignments: boolean;
  availableUnits: typeof fleetUnits;
  pickerUnitId: string;
  onPickerChange: (value: string) => void;
  onAddUnit: () => void;
  usageDetailUnitId: string | null;
  onUsageDetailUnitIdChange: (unitId: string | null) => void;
};

function ProjectWorkspace({
  customerId,
  project,
  hasSavedAssignments,
  availableUnits,
  pickerUnitId,
  onPickerChange,
  onAddUnit,
  usageDetailUnitId,
  onUsageDetailUnitIdChange,
}: ProjectWorkspaceProps) {
  const pinnedAssignment = project.assignments.find(
    (assignment) => assignment.unitId === project.lastTimeTrackedUnitId,
  );

  return (
    <div
      className={[
        "member-projects__panel",
        hasSavedAssignments ? "member-projects__panel--saved" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="tabpanel"
    >
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

      <div className="member-projects__portal-timer-banner" role="status">
        <Timer size={15} aria-hidden className="member-projects__portal-timer-icon" />
        <p className="member-projects__portal-timer-copy">
          <span className="member-projects__portal-timer-label">Visible Portal time credits to</span>{" "}
          {pinnedAssignment ? (
            <strong className="member-projects__portal-timer-target">
              {pinnedAssignment.name} — <DeveloperRedBlinkName name={pinnedAssignment.name} />
            </strong>
          ) : (
            <strong className="member-projects__portal-timer-target">this project (no pinned unit)</strong>
          )}
          . Project total:{" "}
          <span className="member-projects__portal-timer-metric">{formatPortalUsageDuration(project.portalActiveTimeMs)}</span>
          {project.lastPortalActiveAt ? (
            <>
              {" "}
              · last activity{" "}
              <time dateTime={project.lastPortalActiveAt} className="member-projects__portal-timer-metric">
                {formatPortalUsageTimestamp(project.lastPortalActiveAt)}
              </time>
            </>
          ) : null}
          .{" "}
          <button
            type="button"
            className="member-projects__portal-timer-clear glass-effect-interactive"
            onClick={() => setMemberProjectTimeAttributionUnit(customerId, project.id, null)}
          >
            Project-wide timing only
          </button>
        </p>
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
              {availableUnits.length === 0 ? "All 30 units assigned" : "Select developer…"}
            </option>
            {availableUnits.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {getVisibleDeveloperName(unit.name, unit.slot)}
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
              pinnedUnitId={project.lastTimeTrackedUnitId}
              usageDetailOpen={usageDetailUnitId === assignment.unitId}
              onToggleUsageDetail={() =>
                onUsageDetailUnitIdChange(usageDetailUnitId === assignment.unitId ? null : assignment.unitId)
              }
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function SessionForksBadge({ count }: { count: number }) {
  return (
    <span className="member-projects__forks-count" aria-label={`${count} session forks`}>
      {count}
    </span>
  );
}

function UsageSessionsBlock({ sessions }: { sessions: PortalUsageSession[] }) {
  const items = [...sessions].reverse().slice(0, USAGE_SESSION_UI_CAP);
  if (items.length === 0) {
    return (
      <p className="member-projects__usage-sessions-empty">No credited focus segments yet — stay on Portal with this tab visible.</p>
    );
  }
  return (
    <ul className="member-projects__usage-sessions" aria-label="Recent Portal focus segments for this assignment">
      {items.map((session, idx) => (
        <li key={`${session.startedAt}-${session.endedAt}-${idx}`} className="member-projects__usage-session">
          <span className="member-projects__usage-session-range">
            {formatPortalUsageTimestamp(session.startedAt)} → {formatPortalUsageTimestamp(session.endedAt)}
          </span>
          <span className="member-projects__usage-session-duration">
            {formatPortalUsageDuration(session.durationMs)}
          </span>
        </li>
      ))}
    </ul>
  );
}

type AssignmentRowProps = {
  customerId: string;
  projectId: string;
  assignment: ProjectFleetAssignment;
  pinnedUnitId: string | null;
  usageDetailOpen: boolean;
  onToggleUsageDetail: () => void;
};

function AssignmentRow({
  customerId,
  projectId,
  assignment,
  pinnedUnitId,
  usageDetailOpen,
  onToggleUsageDetail,
}: AssignmentRowProps) {
  const [draftSearch, setDraftSearch] = useState(assignment.searchIntent);
  const [editing, setEditing] = useState(!assignment.isSaved);
  const [holdVisible, setHoldVisible] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const holdTimerRef = useRef<number | null>(null);
  const flashTimerRef = useRef<number | null>(null);
  const unitSlot = fleetUnits.find((unit) => unit.id === assignment.unitId)?.slot;
  const accentStyle = typeof unitSlot === "number" ? fleetBayAccentStyle(unitSlot) : undefined;
  const isTimerPinned = pinnedUnitId === assignment.unitId;

  useEffect(() => {
    setDraftSearch(assignment.searchIntent);
    setEditing(!assignment.isSaved);
  }, [assignment.searchIntent, assignment.isSaved, assignment.unitId]);

  useEffect(
    () => () => {
      if (holdTimerRef.current !== null) {
        window.clearTimeout(holdTimerRef.current);
      }
      if (flashTimerRef.current !== null) {
        window.clearTimeout(flashTimerRef.current);
      }
    },
    [],
  );

  const handleSave = () => {
    if (!draftSearch.trim()) {
      return;
    }
    saveProjectAssignment(customerId, projectId, assignment.unitId, draftSearch);
    setEditing(false);
    setJustSaved(true);
    setHoldVisible(true);
    if (flashTimerRef.current !== null) {
      window.clearTimeout(flashTimerRef.current);
    }
    flashTimerRef.current = window.setTimeout(() => {
      setJustSaved(false);
      flashTimerRef.current = null;
    }, SAVE_FLASH_MS);
    if (holdTimerRef.current !== null) {
      window.clearTimeout(holdTimerRef.current);
    }
    holdTimerRef.current = window.setTimeout(() => {
      setHoldVisible(false);
      holdTimerRef.current = null;
    }, HOLD_MESSAGE_MS);
  };

  const handleEdit = () => {
    unlockProjectAssignment(customerId, projectId, assignment.unitId);
    setEditing(true);
    setJustSaved(false);
  };

  const parallelSessions = assignment.sessionForks > 1;
  const locked = assignment.isSaved && !editing;

  return (
    <li
      className={[
        "member-projects__assignment member-projects__assignment--bay-accent",
        locked ? "member-projects__assignment--saved" : "",
        justSaved ? "member-projects__assignment--just-saved" : "",
        isTimerPinned ? "member-projects__assignment--timer-pinned" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={accentStyle as CSSProperties | undefined}
    >
      <AssignmentHead
        assignment={assignment}
        isTimerPinned={isTimerPinned}
        usageDetailOpen={usageDetailOpen}
        onToggleUsageDetail={onToggleUsageDetail}
        onPinTimer={() => setMemberProjectTimeAttributionUnit(customerId, projectId, assignment.unitId)}
      />

      {usageDetailOpen ? (
        <div className="member-projects__usage-detail">
          <p className="member-projects__usage-detail-title">Recent focus segments (newest first)</p>
          <UsageSessionsBlock sessions={assignment.usageSessions} />
        </div>
      ) : null}

      {parallelSessions ? (
        <p className="member-projects__forks-coach" role="alert">
          {assignment.sessionForks} session forks — parallel cockpits burn RAM, scatter your work, and
          force restarts. One unit, one thread, one mission.
        </p>
      ) : null}

      {locked ? (
        <>
          <p className="member-projects__forks-discipline">{SESSION_FORKS_DISCIPLINE}</p>
          <SavedRecord
            assignment={assignment}
            onEdit={handleEdit}
            onRemove={() => removeFleetUnitFromProject(customerId, projectId, assignment.unitId)}
          />
        </>
      ) : (
        <EditForm
          assignment={assignment}
          draftSearch={draftSearch}
          onDraftChange={setDraftSearch}
          onSave={handleSave}
          onRemove={() => removeFleetUnitFromProject(customerId, projectId, assignment.unitId)}
        />
      )}

      {holdVisible ? (
        <p className="member-projects__hold" role="status" aria-live="polite">
          {MEMBER_ASSIGNMENT_HOLD_MESSAGE} Saved to your account — see mission log above.
        </p>
      ) : null}
    </li>
  );
}

type AssignmentHeadProps = {
  assignment: ProjectFleetAssignment;
  isTimerPinned: boolean;
  usageDetailOpen: boolean;
  onToggleUsageDetail: () => void;
  onPinTimer: () => void;
};

function AssignmentHead({
  assignment,
  isTimerPinned,
  usageDetailOpen,
  onToggleUsageDetail,
  onPinTimer,
}: AssignmentHeadProps) {
  const { session } = useMemberAuth();
  const freeTier = computeFreeTierUsage(session, assignment.sessionForks, assignment.activeTimeMs);

  return (
    <div className="member-projects__assignment-head-wrap">
      <div className="member-projects__assignment-head">
        <div>
          <p className="member-projects__callsign">{assignment.name}</p>
          <p className="member-projects__unit-name">
            <DeveloperRedBlinkName name={assignment.name} />
          </p>
        </div>
        <div className="member-projects__head-metrics member-projects__head-metrics--browser">
          <div className="member-projects__forks" aria-label="Browser launches for this assignment">
            <span className="member-projects__forks-label">Browser launches</span>
            <SessionForksBadge count={assignment.sessionForks} />
          </div>
          <div className="member-projects__usage" aria-label="Time in browser for this assignment on this device">
            <span className="member-projects__usage-label">Time in browser</span>
            <span className="member-projects__usage-count">{formatPortalUsageDuration(assignment.activeTimeMs)}</span>
          </div>
          <div className="member-projects__usage member-projects__usage--tier" aria-label="Free tier remaining">
            <span className="member-projects__usage-label">Free tier</span>
            <span className="member-projects__usage-count member-projects__usage-count--tier">{freeTier.label}</span>
          </div>
        </div>
      </div>
      {assignment.lastActiveAt ? (
        <p className="member-projects__last-activity">
          Last activity{" "}
          <time dateTime={assignment.lastActiveAt}>{formatPortalUsageTimestamp(assignment.lastActiveAt)}</time>
        </p>
      ) : null}
      <div className="member-projects__assignment-usage-actions">
        <button
          type="button"
          className={[
            "member-projects__usage-toggle glass-effect-interactive",
            usageDetailOpen ? "member-projects__usage-toggle--open" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={onToggleUsageDetail}
          aria-expanded={usageDetailOpen}
        >
          <ChevronDown size={14} aria-hidden className="member-projects__usage-toggle-chevron" />
          Sessions
        </button>
        <button type="button" className="member-projects__pin-timer-btn glass-effect-interactive" onClick={onPinTimer}>
          Count visible time here
        </button>
        {isTimerPinned ? (
          <span className="member-projects__timer-pinned-badge" aria-label="Portal timer pinned to this unit">
            Timer pinned
          </span>
        ) : null}
      </div>
    </div>
  );
}

type SavedRecordProps = {
  assignment: ProjectFleetAssignment;
  onEdit: () => void;
  onRemove: () => void;
};

function SavedRecord({ assignment, onEdit, onRemove }: SavedRecordProps) {
  return (
    <div className="member-projects__saved-record">
      <div className="member-projects__saved-fields">
        <div className="member-projects__saved-field">
          <span className="member-projects__field-label">Fleet unit</span>
          <p className="member-projects__saved-value">
            {assignment.name} — <DeveloperRedBlinkName name={assignment.name} />
          </p>
        </div>
        <div className="member-projects__saved-field">
          <span className="member-projects__field-label">Prompt call sign</span>
          <p className="member-projects__saved-value">{highlightDeveloperCoPilotName(assignment.copilotName)}</p>
        </div>
        <div className="member-projects__saved-field">
          <span className="member-projects__field-label">What you are searching</span>
          <p className="member-projects__saved-value">{assignment.searchIntent}</p>
        </div>
        <div className="member-projects__saved-field">
          <span className="member-projects__field-label">Saved at</span>
          <p className="member-projects__saved-value member-projects__saved-value--timestamp">
            <time dateTime={assignment.savedAt}>{formatSavedTimestamp(assignment.savedAt)}</time>
          </p>
        </div>
      </div>
      <div className="member-projects__assignment-actions member-projects__assignment-actions--saved">
        <span className="member-projects__saved-badge" aria-label="Assignment saved">
          Saved
        </span>
        <button type="button" className="member-projects__edit-btn glass-effect-interactive" onClick={onEdit}>
          <Pencil size={11} aria-hidden />
          Edit
        </button>
        <button type="button" className="member-projects__remove glass-effect-interactive" onClick={onRemove}>
          <Minus size={12} aria-hidden />
          Remove
        </button>
      </div>
    </div>
  );
}

type EditFormProps = {
  assignment: ProjectFleetAssignment;
  draftSearch: string;
  onDraftChange: (value: string) => void;
  onSave: () => void;
  onRemove: () => void;
};

function EditForm({ assignment, draftSearch, onDraftChange, onSave, onRemove }: EditFormProps) {
  return (
    <>
      <div className="member-projects__field">
        <span className="member-projects__field-label">Co-Pilot name</span>
        <p className="member-projects__copilot-preview" aria-readonly="true">
          {highlightDeveloperCoPilotName(assignment.copilotName)}
        </p>
      </div>

      <label className="member-projects__field">
        <span className="member-projects__field-label">Enter what you are searching</span>
        <input
          className="member-projects__input"
          type="text"
          value={draftSearch}
          onChange={(event) => onDraftChange(event.target.value)}
          placeholder='e.g. "Help me build my house"'
          maxLength={120}
        />
      </label>

      <div className="member-projects__assignment-actions">
        <button
          type="button"
          className="member-projects__save-btn btn-glass glass-effect glass-effect-interactive"
          onClick={onSave}
          disabled={!draftSearch.trim()}
        >
          <Save size={13} aria-hidden />
          Save assignment
        </button>

        <button type="button" className="member-projects__remove glass-effect-interactive" onClick={onRemove}>
          <Minus size={12} aria-hidden />
          Remove
        </button>
      </div>
    </>
  );
}
