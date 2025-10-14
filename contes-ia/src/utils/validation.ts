// Utilitaires de validation pour les formulaires
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email) {
    return { isValid: false, error: 'L\'email est obligatoire' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Format d\'email invalide' };
  }
  
  return { isValid: true };
};

export const validateAge = (age: string): { isValid: boolean; error?: string } => {
  if (!age) {
    return { isValid: false, error: 'L\'âge est obligatoire' };
  }
  
  const ageNumber = parseInt(age);
  if (isNaN(ageNumber) || ageNumber < 0 || ageNumber > 120) {
    return { isValid: false, error: 'L\'âge doit être un nombre valide entre 0 et 120' };
  }
  
  return { isValid: true };
};

export const validatePostalCode = (postalCode: string): { isValid: boolean; error?: string } => {
  if (!postalCode) {
    return { isValid: false, error: 'Le code postal est obligatoire' };
  }
  
  // Format français : 5 chiffres
  const postalCodeRegex = /^[0-9]{5}$/;
  if (!postalCodeRegex.test(postalCode)) {
    return { isValid: false, error: 'Le code postal doit contenir 5 chiffres' };
  }
  
  return { isValid: true };
};

export const validateAddress = (address: string): { isValid: boolean; error?: string } => {
  if (!address || address.trim().length < 5) {
    return { isValid: false, error: 'L\'adresse doit contenir au moins 5 caractères' };
  }
  
  return { isValid: true };
};

export const validateCity = (city: string): { isValid: boolean; error?: string } => {
  if (!city || city.trim().length < 2) {
    return { isValid: false, error: 'La ville doit contenir au moins 2 caractères' };
  }
  
  // Vérifier que la ville ne contient que des lettres, espaces, tirets et apostrophes
  const cityRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
  if (!cityRegex.test(city)) {
    return { isValid: false, error: 'La ville ne peut contenir que des lettres, espaces, tirets et apostrophes' };
  }
  
  return { isValid: true };
};

export const validateRequired = (value: string, fieldName: string): { isValid: boolean; error?: string } => {
  if (!value || value.trim().length === 0) {
    return { isValid: false, error: `${fieldName} est obligatoire` };
  }
  
  return { isValid: true };
};
