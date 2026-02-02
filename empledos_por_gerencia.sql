SELECT 
    c.nombre, 
    c.apellido, 
    ca.nombre_cargo AS cargo, 
    c.email, 
    c.fecha_ingreso
FROM colaboradores c
JOIN departamentos d ON c.id_departamento = d.id_departamento
JOIN cargos ca ON c.id_cargo = ca.id_cargo
WHERE d.nombre_departamento = 'GERENCIA DE TECNOLOGIA'
ORDER BY c.apellido ASC;