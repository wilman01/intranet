SELECT 
    c.nombre, 
    c.apellido, 
    d.nombre_departamento AS departamento,
    ca.nombre_cargo AS cargo,
    DATE_FORMAT(c.fecha_nacimiento, '%d de %M') AS dia_cumpleaños,
    (YEAR(CURDATE()) - YEAR(c.fecha_nacimiento)) AS edad_que_cumple
FROM colaboradores c
JOIN departamentos d ON c.id_departamento = d.id_departamento
JOIN cargos ca ON c.id_cargo = ca.id_cargo
WHERE MONTH(c.fecha_nacimiento) = MONTH(CURDATE())
ORDER BY DAY(c.fecha_nacimiento) ASC;