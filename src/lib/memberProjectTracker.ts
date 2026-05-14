import type { FleetUnit } from "../types/fleet";
import {
  memberClearanceDisplayLabel,
  memberClearanceRank,
  membershipTenureLabel,
} from "./memberAccessLevel";
import type { MemberSession } from "../types/member";
import { readMemberSession } from "./memberSession";

export const MEMBER_PROJECTS_STORAGE_KEY = "usjet-member-projects";
export const MEMBER_ACTIVE_PROJECT_KEY = "usjet-member-active-project";

export type ProjectFleetAssignment = {
  unitId: string;
  callsign: string;
  name: string;
  /** Auto-generated on add — e.g. "Gemini Co-Pilot". */
  copilotName: string;
  /** User's search / task intent for their own record. */
  searchIntent: string;
  savedAt: string;
  isSaved: boolean;
  /** Cockpit / browser launches for this unit on this project (one thread per launch). */
  sessionForks: number;
};

export type MemberProject = {
  id: string;
  name: string;
  createdAt: string;
  assignments: ProjectFleetAssignment[];
};

type MemberProjectsByCustomer = Record<string, MemberProject[]>;
type ActiveProjectByCustomer = Record<string, string>;

const PROJECTS_UPDATED_EVENT = "usjet-member-projects-updated";

function newId(): string {
  return `proj_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function buildCopilotName(fleetUnitName: string): string {
  const trimmed = fleetUnitName.trim();
  return trimmed ? `${trimmed} Co-Pilot` : "Co-Pilot";
}

function normalizeAssignment(raw: Record<string, unknown>): ProjectFleetAssignment {
  const sessionForks =
    typeof raw.sessionForks === "number"
      ? raw.sessionForks
      : typeof raw.usageCount === "number"
        ? raw.usageCount
        : 0;

  const unitName = String(raw.name ?? "");
  const legacyJob = String(raw.jobDescription ?? "");
  const searchIntent = String(raw.searchIntent ?? legacyJob);
  const migratedSaved = searchIntent.trim().length > 0;

  return {
    unitId: String(raw.unitId ?? ""),
    callsign: String(raw.callsign ?? ""),
    name: unitName,
    copilotName: String(
      raw.copilotName ?? (unitName ? buildCopilotName(unitName) : ""),
    ),
    searchIntent,
    savedAt: String(raw.savedAt ?? (migratedSaved ? new Date().toISOString() : "")),
    isSaved: Boolean(raw.isSaved ?? migratedSaved),
    sessionForks,
  };
}

function normalizeProject(raw: Record<string, unknown>): MemberProject {
  const assignments = Array.isArray(raw.assignments)
    ? raw.assignments.map((entry) => normalizeAssignment(entry as Record<string, unknown>))
    : [];

  return {
    id: String(raw.id ?? ""),
    name: String(raw.name ?? ""),
    createdAt: String(raw.createdAt ?? new Date().toISOString()),
    assignments,
  };
}

function readStore(): MemberProjectsByCustomer {
  try {
    const raw = localStorage.getItem(MEMBER_PROJECTS_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    const store: MemberProjectsByCustomer = {};
    for (const [customerId, projects] of Object.entries(parsed)) {
      if (!Array.isArray(projects)) {
        continue;
      }
      store[customerId] = projects.map((project) =>
        normalizeProject(project as Record<string, unknown>),
      );
    }
    return store;
  } catch {
    return {};
  }
}

function writeStore(store: MemberProjectsByCustomer): void {
  localStorage.setItem(MEMBER_PROJECTS_STORAGE_KEY, JSON.stringify(store));
  window.dispatchEvent(new CustomEvent(PROJECTS_UPDATED_EVENT));
}

function readActiveProjectStore(): ActiveProjectByCustomer {
  try {
    const raw = localStorage.getItem(MEMBER_ACTIVE_PROJECT_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as ActiveProjectByCustomer;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeActiveProjectStore(store: ActiveProjectByCustomer): void {
  localStorage.setItem(MEMBER_ACTIVE_PROJECT_KEY, JSON.stringify(store));
}

function projectsFor(customerId: string): MemberProject[] {
  return readStore()[customerId] ?? [];
}

function saveProjects(customerId: string, projects: MemberProject[]): void {
  const store = readStore();
  store[customerId] = projects;
  writeStore(store);
}

function updateProject(
  customerId: string,
  projectId: string,
  updater: (project: MemberProject) => MemberProject,
): MemberProject | null {
  const projects = projectsFor(customerId);
  const index = projects.findIndex((project) => project.id === projectId);
  if (index < 0) {
    return null;
  }
  const next = [...projects];
  next[index] = updater(projects[index]);
  saveProjects(customerId, next);
  return next[index];
}

function callsignKey(callsign: string): string {
  return callsign.trim().toUpperCase();
}

function resolveProjectForSessionFork(
  customerId: string,
  callsign: string,
): string | null {
  const key = callsignKey(callsign);
  const projects = projectsFor(customerId);
  const activeProjectId = readActiveProjectStore()[customerId];
  const activeProject = projects.find((project) => project.id === activeProjectId);

  if (
    activeProject?.assignments.some(
      (assignment) => callsignKey(assignment.callsign) === key,
    )
  ) {
    return activeProject.id;
  }

  const matches = projects.filter((project) =>
    project.assignments.some((assignment) => callsignKey(assignment.callsign) === key),
  );

  return matches.length === 1 ? matches[0].id : null;
}

export function setMemberActiveProject(customerId: string, projectId: string): void {
  const store = readActiveProjectStore();
  store[customerId] = projectId;
  writeActiveProjectStore(store);
}

export function readMemberProjects(customerId: string): MemberProject[] {
  return projectsFor(customerId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export type SavedMissionRecord = {
  projectId: string;
  projectName: string;
  assignment: ProjectFleetAssignment;
};

/** All saved assignments for this member — newest save first. */
export function readMemberActiveProjectId(customerId: string): string | null {
  return readActiveProjectStore()[customerId] ?? null;
}

export type MemberProjectStats = {
  projectCount: number;
  totalSessionForks: number;
  activeProjectId: string | null;
  activeProjectName: string | null;
};

export function getMemberProjectStats(customerId: string): MemberProjectStats {
  const projects = readMemberProjects(customerId);
  const activeProjectId =
    readMemberActiveProjectId(customerId) ?? projects[0]?.id ?? null;
  const activeProject = projects.find((project) => project.id === activeProjectId);
  const totalSessionForks = projects.reduce(
    (sum, project) =>
      sum + project.assignments.reduce((forkSum, assignment) => forkSum + assignment.sessionForks, 0),
    0,
  );

  return {
    projectCount: projects.length,
    totalSessionForks,
    activeProjectId,
    activeProjectName: activeProject?.name ?? null,
  };
}

/** Serialize Mission Projects for Aura — ground-truth member intelligence in Origin chat. */
export function buildOriginMemberContext(session: MemberSession | null): string | undefined {
  if (!session?.active) {
    return undefined;
  }

  const customerId = session.customerId;
  const projects = readMemberProjects(customerId);
  const stats = getMemberProjectStats(customerId);
  const activeProjectId = stats.activeProjectId;
  const savedRecords = readSavedMissionRecords(customerId);
  const clearanceRank = memberClearanceRank(session);
  const clearanceLabel = memberClearanceDisplayLabel(session);

  const lines: string[] = [
    "MEMBER_CONTEXT (ground truth — cite only these values; never invent counts or names):",
    "loggedIn: true",
    `customerId: ${customerId}`,
    ...(session.email ? [`email: ${session.email}`] : []),
    `tier: ${session.tier}`,
    ...(session.accessLevel ? [`accessLevel: ${session.accessLevel}`] : []),
    ...(session.stripeTier ? [`stripeTier: ${session.stripeTier}`] : []),
    `clearanceRank: ${clearanceRank}`,
    `clearanceLabel: ${clearanceLabel}`,
    `founderGodMode: ${session.founderGodMode === true}`,
    `verifiedAt: ${session.verifiedAt}`,
    `membershipTenure: ${membershipTenureLabel(session.verifiedAt)}`,
    ...(session.legacyId ? [`legacyId: ${session.legacyId}`] : []),
    `activeProjectId: ${activeProjectId ?? "none"}`,
    `activeProjectName: ${stats.activeProjectName ?? "none"}`,
    `projectCount: ${stats.projectCount}`,
    `totalSessionForks: ${stats.totalSessionForks}`,
  ];

  if (projects.length === 0) {
    lines.push("projects: none — member has not created Mission Projects yet.");
  } else {
    for (const project of projects) {
      const isActive = project.id === activeProjectId;
      lines.push(
        `PROJECT id=${project.id} name="${project.name}" created=${project.createdAt} active=${isActive} assignmentCount=${project.assignments.length}`,
      );

      if (project.assignments.length === 0) {
        lines.push("  assignments: none");
        continue;
      }

      const firstSaved = project.assignments.find(
        (assignment) => assignment.isSaved && assignment.searchIntent.trim(),
      );
      const firstSearchMatchesProject =
        firstSaved &&
        firstSaved.searchIntent.trim().toLowerCase() === project.name.trim().toLowerCase();

      for (const assignment of project.assignments) {
        const isFirstSaved = assignment === firstSaved;
        const ruleNote =
          isFirstSaved && firstSearchMatchesProject
            ? " firstSearchEqualsProjectName=true (USJET rule: first search mirrors project name until they rename the project or edit the assignment)"
            : "";
        lines.push(
          [
            `  ASSIGNMENT unit="${assignment.name}"`,
            `callsign=${assignment.callsign}`,
            `copilotName="${assignment.copilotName}"`,
            `searchIntent="${assignment.searchIntent.trim() || "(empty)"}"`,
            `saved=${assignment.isSaved}`,
            `savedAt=${assignment.savedAt || "—"}`,
            `sessionForks=${assignment.sessionForks}${ruleNote}`,
          ].join(" "),
        );
      }
    }
  }

  if (savedRecords.length === 0) {
    lines.push("savedMissions: none");
  } else {
    lines.push(`savedMissionCount: ${savedRecords.length}`);
    for (const record of savedRecords) {
      lines.push(
        [
          `SAVED_MISSION project="${record.projectName}"`,
          `unit="${record.assignment.name}"`,
          `copilot="${record.assignment.copilotName}"`,
          `search="${record.assignment.searchIntent}"`,
          `forks=${record.assignment.sessionForks}`,
          `savedAt=${record.assignment.savedAt}`,
        ].join(" "),
      );
    }
  }

  lines.push(
    "RULE: Until a member renames a project or edits an assignment, the first saved search intent often equals the project name — treat that as their opening mission subject.",
    "If a field is missing or count is zero, say you have no record yet — do not guess.",
  );

  return lines.join("\n");
}

export function readSavedMissionRecords(customerId: string): SavedMissionRecord[] {
  return readMemberProjects(customerId).flatMap((project) =>
    project.assignments
      .filter((assignment) => assignment.isSaved && assignment.searchIntent.trim())
      .map((assignment) => ({
        projectId: project.id,
        projectName: project.name,
        assignment,
      })),
  ).sort(
    (a, b) =>
      new Date(b.assignment.savedAt).getTime() - new Date(a.assignment.savedAt).getTime(),
  );
}

export function createMemberProject(customerId: string, name: string): MemberProject | null {
  const trimmed = name.trim();
  if (!trimmed) {
    return null;
  }

  const project: MemberProject = {
    id: newId(),
    name: trimmed,
    createdAt: new Date().toISOString(),
    assignments: [],
  };

  saveProjects(customerId, [project, ...projectsFor(customerId)]);
  setMemberActiveProject(customerId, project.id);
  return project;
}

export function deleteMemberProject(customerId: string, projectId: string): void {
  saveProjects(
    customerId,
    projectsFor(customerId).filter((project) => project.id !== projectId),
  );
}

export function addFleetUnitToProject(
  customerId: string,
  projectId: string,
  unit: FleetUnit,
): ProjectFleetAssignment | null {
  let created: ProjectFleetAssignment | null = null;

  updateProject(customerId, projectId, (project) => {
    if (project.assignments.some((assignment) => assignment.unitId === unit.id)) {
      return project;
    }

    created = {
      unitId: unit.id,
      callsign: unit.callsign,
      name: unit.name,
      copilotName: buildCopilotName(unit.name),
      searchIntent: "",
      savedAt: "",
      isSaved: false,
      sessionForks: 0,
    };

    return {
      ...project,
      assignments: [...project.assignments, created],
    };
  });

  return created;
}

export function removeFleetUnitFromProject(
  customerId: string,
  projectId: string,
  unitId: string,
): void {
  updateProject(customerId, projectId, (project) => ({
    ...project,
    assignments: project.assignments.filter((assignment) => assignment.unitId !== unitId),
  }));
}

export function saveProjectAssignment(
  customerId: string,
  projectId: string,
  unitId: string,
  searchIntent: string,
): void {
  const trimmed = searchIntent.trim();
  updateProject(customerId, projectId, (project) => ({
    ...project,
    assignments: project.assignments.map((assignment) =>
      assignment.unitId === unitId
        ? {
            ...assignment,
            searchIntent: trimmed,
            isSaved: true,
            savedAt: new Date().toISOString(),
          }
        : assignment,
    ),
  }));
}

export function unlockProjectAssignment(
  customerId: string,
  projectId: string,
  unitId: string,
): void {
  updateProject(customerId, projectId, (project) => ({
    ...project,
    assignments: project.assignments.map((assignment) =>
      assignment.unitId === unitId ? { ...assignment, isSaved: false } : assignment,
    ),
  }));
}

/** Bump project-scoped session fork when an active member launches a fleet unit. */
export function logProjectSessionForkIfMember(customerId: string, callsign: string): void {
  const session = readMemberSession();
  if (!session?.active || session.customerId !== customerId) {
    return;
  }

  const projectId = resolveProjectForSessionFork(customerId, callsign);
  if (!projectId) {
    return;
  }

  const key = callsignKey(callsign);
  let changed = false;

  const next = projectsFor(customerId).map((project) => {
    if (project.id !== projectId) {
      return project;
    }

    let projectChanged = false;
    const assignments = project.assignments.map((assignment) => {
      if (callsignKey(assignment.callsign) !== key) {
        return assignment;
      }
      projectChanged = true;
      return { ...assignment, sessionForks: assignment.sessionForks + 1 };
    });

    if (projectChanged) {
      changed = true;
      return { ...project, assignments };
    }
    return project;
  });

  if (changed) {
    saveProjects(customerId, next);
  }
}

export function subscribeMemberProjects(onChange: () => void): () => void {
  const handler = () => onChange();
  window.addEventListener(PROJECTS_UPDATED_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(PROJECTS_UPDATED_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
