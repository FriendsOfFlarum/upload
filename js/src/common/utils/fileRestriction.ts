import type File from '../models/File';

export type FileRestriction = string | string[] | null | undefined;

const FAMILIES = ['image', 'audio', 'video'];

export function matchesRestriction(type: string, restriction: FileRestriction): boolean {
  if (!restriction) return true;

  if (Array.isArray(restriction)) return restriction.includes(type);

  if (FAMILIES.includes(restriction)) return type.startsWith(`${restriction}/`);

  return type === restriction;
}

export function fileMatchesRestriction(file: File, restriction: FileRestriction): boolean {
  return matchesRestriction(file.type() ?? '', restriction);
}
