
SELECT nombre, apellido, email
FROM colaboradores
WHERE MONTH(fecha_ingreso) = MONTH(DATE_ADD(CURDATE(), INTERVAL 1 DAY))
  AND DAY(fecha_ingreso) = DAY(DATE_ADD(CURDATE(), INTERVAL 1 DAY));