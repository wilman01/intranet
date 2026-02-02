SELECT 
    d.nombre_departamento AS departamento,
    c.nombre, 
    c.apellido, 
    ca.nombre_cargo AS cargo
FROM colaboradores c
JOIN departamentos d ON c.id_departamento = d.id_departamento
JOIN cargos ca ON c.id_cargo = ca.id_cargo
ORDER BY d.nombre_departamento, c.apellido;