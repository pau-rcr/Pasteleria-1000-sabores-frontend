export function getAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

export function isBirthdayToday(dateOfBirth: string): boolean {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  return (
      birthDate.getMonth() === today.getMonth() &&
      birthDate.getDate() === today.getDate()
  );
}

export function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();

  return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
  );
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}
