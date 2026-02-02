SELECT 
    d.nombre_departamento, 
    COUNT(c.id_colaborador) AS total_empleados
FROM departamentos d
LEFT JOIN colaboradores c ON d.id_departamento = c.id_departamento
GROUP BY d.nombre_departamento
ORDER BY total_empleados DESC;