export function isValidEmail(email: string): boolean {
  const allowedDomains = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) return false;

  return allowedDomains.some(domain => email.toLowerCase().endsWith(domain));
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

export function isAdult(dateOfBirth: string): boolean {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= 18;
  }

  return age >= 18;
}
