SELECT nombre, apellido, fecha_nacimiento 
FROM colaboradores 
WHERE MONTH(fecha_nacimiento) = MONTH(CURDATE()) 
  AND DAY(fecha_nacimiento) = DAY(CURDATE());