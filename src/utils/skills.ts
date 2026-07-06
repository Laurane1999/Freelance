/**
 * Skills are stored as a string[] in Firestore (docs/03_DATABASE) but edited as
 * a single comma-separated field in the UI. These helpers convert between them.
 */
export function parseSkills(text: string): string[] {
  return text
    .split(',')
    .map((skill) => skill.trim())
    .filter((skill) => skill.length > 0);
}

export function skillsToText(skills: string[]): string {
  return skills.join(', ');
}
