SELECT 
    c.nombre, 
    c.apellido, 
    d.nombre_departamento AS departamento,
    ca.nombre_cargo AS cargo,
    DATE_FORMAT(c.fecha_ingreso, '%d de %M') AS dia_aniversario,
    (YEAR(CURDATE()) - YEAR(c.fecha_ingreso)) AS cantidad_años
FROM colaboradores c
JOIN departamentos d ON c.id_departamento = d.id_departamento
JOIN cargos ca ON c.id_cargo = ca.id_cargo
WHERE MONTH(c.fecha_ingreso) = MONTH(CURDATE())
ORDER BY DAY(c.fecha_ingreso) ASC;