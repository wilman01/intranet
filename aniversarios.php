<?php
// Incluimos la conexión externa
require_once 'db.php';

// Consulta para los aniversarios del mes actual
$sql = "SELECT c.nombre, c.apellido, d.nombre_departamento, c.foto_ruta,
               DAY(c.fecha_ingreso) as dia,
               (YEAR(CURDATE()) - YEAR(c.fecha_ingreso)) as anos
        FROM colaboradores c
        JOIN departamentos d ON c.id_departamento = d.id_departamento
        WHERE MONTH(c.fecha_ingreso) = MONTH(CURDATE())
        ORDER BY dia ASC";

$stmt = $pdo->query($sql);
$aniversariantes = $stmt->fetchAll();
?>