import type { FleetUnit } from "../types/fleet";
import { readMemberSession } from "./memberSession";

export const MEMBER_PROJECTS_STORAGE_KEY = "usjet-member-projects";

export type ProjectFleetAssignment = {
  unitId: string;
  callsign: string;
  name: string;
  jobDescription: string;
  usageCount: number;
};

export type MemberProject = {
  id: string;
  name: string;
  createdAt: string;
  assignments: ProjectFleetAssignment[];
};

type MemberProjectsByCustomer = Record<string, MemberProject[]>;

const PROJECTS_UPDATED_EVENT = "usjet-member-projects-updated";

function newId(): string {
  return `proj_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function readStore(): MemberProjectsByCustomer {
  try {
    const raw = localStorage.getItem(MEMBER_PROJECTS_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as MemberProjectsByCustomer;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeStore(store: MemberProjectsByCustomer): void {
  localStorage.setItem(MEMBER_PROJECTS_STORAGE_KEY, JSON.stringify(store));
  window.dispatchEvent(new CustomEvent(PROJECTS_UPDATED_EVENT));
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

export function readMemberProjects(customerId: string): MemberProject[] {
  return projectsFor(customerId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
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
      jobDescription: "",
      usageCount: 0,
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

export function updateProjectJobDescription(
  customerId: string,
  projectId: string,
  unitId: string,
  jobDescription: string,
): void {
  updateProject(customerId, projectId, (project) => ({
    ...project,
    assignments: project.assignments.map((assignment) =>
      assignment.unitId === unitId ? { ...assignment, jobDescription } : assignment,
    ),
  }));
}

export function incrementProjectFleetUsage(
  customerId: string,
  projectId: string,
  unitId: string,
): void {
  updateProject(customerId, projectId, (project) => ({
    ...project,
    assignments: project.assignments.map((assignment) =>
      assignment.unitId === unitId
        ? { ...assignment, usageCount: assignment.usageCount + 1 }
        : assignment,
    ),
  }));
}

/** Bump project-scoped usage when an active member logs a fleet launch. */
export function logProjectFleetUsageIfMember(customerId: string, callsign: string): void {
  const session = readMemberSession();
  if (!session?.active || session.customerId !== customerId) {
    return;
  }

  const key = callsign.trim().toUpperCase();
  const projects = projectsFor(customerId);
  let changed = false;

  const next = projects.map((project) => {
    let projectChanged = false;
    const assignments = project.assignments.map((assignment) => {
      if (assignment.callsign.trim().toUpperCase() !== key) {
        return assignment;
      }
      projectChanged = true;
      return { ...assignment, usageCount: assignment.usageCount + 1 };
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
