//Validaciones

export function validateLimit(limit) {
  if (Number.isNaN(limit)) {
    throw new Error("El parámetro 'limit' debe ser un número.");
  }
  if (limit <= 0 || limit > 200) {
    throw new Error("'limit' entre 1 y 200.");
  }
}

export function validateProductId(id) {
  if (Number.isNaN(id) || id <= 0) {
    throw new Error("El ID del producto debe ser un número entero positivo.");
  }
}

export function validateArrayOfStrings(arr, fieldName) {
  if (!Array.isArray(arr) || !arr.every((item) => typeof item === "string")) {
    throw new Error(
      `El array '${fieldName}' solo recibe strings.`
    );
  }
  if (arr.length === 0) {
    throw new Error(` '${fieldName}' indefinido.`);
  }
  return true;
}

export function validateType(value, expectedType, fieldName) {
  const valueType = typeof value;
  if (valueType !== expectedType) {
    throw new Error(
      `Doc: ${fieldName} espera ${expectedType} recebido ${valueType}.`
    );
  }
  return true;
}

export function validateUpdates(updates, allowedProperties) {
  return Object.keys(updates).reduce((acc, key) => {
    if (allowedProperties.includes(key)) {
      if (
        updates[key] === undefined ||
        updates[key] === null ||
        updates[key] === ""
      ) {
        throw new Error(`El campo ${key} debe tener un valor definido.`);
      }
      acc[key] = updates[key];
    }
    return acc;
  }, {});
}
