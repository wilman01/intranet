import pandas as pd
import os
import shutil
from openpyxl import load_workbook
from io import BytesIO

archivo_entrada = 'colaboradores_intranet_new.xlsx'
archivo_salida_mysql = 'base_datos_intranet_mysql.sql'
archivo_salida_pg = 'base_datos_intranet_postgres.sql'
carpeta_fotos = 'fotos_colaboradores'

def safe_name(nom, ape):
    nombre_archivo = f"{nom.lower().replace(' ', '_')}_{ape.lower().replace(' ', '_')}.jpg"
    return nombre_archivo

def format_date(val):
    if pd.notna(val):
        try:
            return f"'{pd.to_datetime(val, dayfirst=True).strftime('%Y-%m-%d')}'"
        except:
            return "NULL"
    return "NULL"

try:
    df = pd.read_excel(archivo_entrada)
    df.columns = df.columns.str.strip()

    col_nombre = 'NOMBRE'
    col_apellido = 'APELLIDO'
    col_dept = 'DEPARTAMENTO'
    col_cargo = 'CARGO'
    col_email = 'EMAIL'
    col_fec_ing = 'FEC INGRESO'
    col_fec_nac = 'FEC NACIMIENTO'
    col_sexo = 'SEXO'

    if not os.path.exists(carpeta_fotos):
        os.makedirs(carpeta_fotos)

    wb = load_workbook(archivo_entrada)
    ws = wb.active

    imagenes_por_row = {}
    for img in ws._images:
        anchor = img.anchor
        from_obj = getattr(anchor, '_from', None)
        if from_obj:
            row = from_obj.row + 1
            if row not in imagenes_por_row:
                imagenes_por_row[row] = img

    departamentos = sorted(df[col_dept].dropna().unique())
    cargos = sorted(df[col_cargo].dropna().unique())

    dept_map = {nombre: i + 1 for i, nombre in enumerate(departamentos)}
    cargo_map = {nombre: i + 1 for i, nombre in enumerate(cargos)}

    with open(archivo_salida_mysql, 'w', encoding='utf-8') as f_mysql, \
         open(archivo_salida_pg, 'w', encoding='utf-8') as f_pg:

        ddl_mysql = """CREATE TABLE departamentos (
    id_departamento INT AUTO_INCREMENT PRIMARY KEY,
    nombre_departamento VARCHAR(150) NOT NULL UNIQUE
);
CREATE TABLE cargos (
    id_cargo INT AUTO_INCREMENT PRIMARY KEY,
    nombre_cargo VARCHAR(150) NOT NULL UNIQUE
);
CREATE TABLE colaboradores (
    id_colaborador INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    fecha_nacimiento DATE,
    sexo VARCHAR(20),
    fecha_ingreso DATE,
    id_departamento INT,
    id_cargo INT,
    foto_ruta VARCHAR(255),
    FOREIGN KEY (id_departamento) REFERENCES departamentos(id_departamento),
    FOREIGN KEY (id_cargo) REFERENCES cargos(id_cargo)
);
"""
        ddl_pg = """CREATE TABLE departamentos (
    id_departamento SERIAL PRIMARY KEY,
    nombre_departamento VARCHAR(150) NOT NULL UNIQUE
);
CREATE TABLE cargos (
    id_cargo SERIAL PRIMARY KEY,
    nombre_cargo VARCHAR(150) NOT NULL UNIQUE
);
CREATE TABLE colaboradores (
    id_colaborador SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    fecha_nacimiento DATE,
    sexo VARCHAR(20),
    fecha_ingreso DATE,
    id_departamento INTEGER,
    id_cargo INTEGER,
    foto_ruta VARCHAR(255),
    FOREIGN KEY (id_departamento) REFERENCES departamentos(id_departamento),
    FOREIGN KEY (id_cargo) REFERENCES cargos(id_cargo)
);
"""

        f_mysql.write(ddl_mysql)
        f_pg.write(ddl_pg)

        for nombre in departamentos:
            f_mysql.write(f"INSERT INTO departamentos (nombre_departamento) VALUES ('{nombre}');\n")
            f_pg.write(f"INSERT INTO departamentos (nombre_departamento) VALUES ('{nombre}');\n")

        for nombre in cargos:
            f_mysql.write(f"INSERT INTO cargos (nombre_cargo) VALUES ('{nombre}');\n")
            f_pg.write(f"INSERT INTO cargos (nombre_cargo) VALUES ('{nombre}');\n")

        f_mysql.write("\n-- REGISTROS DE COLABORADORES\n")
        f_pg.write("\n-- REGISTROS DE COLABORADORES\n")

        fotos_copiadas = []

        for i, row in df.iterrows():
            row_idx = i + 2

            nombre_valor = row[col_nombre]
            if isinstance(nombre_valor, (float, int)) and pd.isna(nombre_valor):
                continue
            if not isinstance(nombre_valor, (float, int)) and not bool(nombre_valor):
                continue

            nom = str(row[col_nombre]).replace("'", "''").strip()
            ape = str(row[col_apellido]).replace("'", "''").strip()

            f_ing = format_date(row[col_fec_ing])
            f_nac = format_date(row[col_fec_nac])
            sexo_val = f"'{str(row[col_sexo]).strip()}'" if pd.notna(row[col_sexo]) and bool(row[col_sexo]) else "NULL"

            d_id = dept_map[row[col_dept]]
            c_id = cargo_map[row[col_cargo]]
            foto_nombre = safe_name(nom, ape)
            foto_ruta = f"'{foto_nombre}'"

            if row_idx in imagenes_por_row:
                img = imagenes_por_row[row_idx]
                foto_destino = os.path.join(carpeta_fotos, foto_nombre)
                try:
                    img_bytes = img._data()
                    img_io = BytesIO(img_bytes)
                    from PIL import Image
                    pil_img = Image.open(img_io)
                    if pil_img.mode in ('RGBA', 'LA', 'P'):
                        pil_img = pil_img.convert('RGB')
                    pil_img.save(foto_destino)
                    fotos_copiadas.append(foto_nombre)
                except Exception as e:
                    print(f"Error extrayendo imagen para {nom} {ape}: {e}")

            f_mysql.write(f"INSERT INTO colaboradores (nombre, apellido, fecha_nacimiento, sexo, fecha_ingreso, id_departamento, id_cargo, foto_ruta) "
                          f"VALUES ('{nom}', '{ape}', {f_nac}, {sexo_val}, {f_ing}, {d_id}, {c_id}, {foto_ruta});\n")
            f_pg.write(f"INSERT INTO colaboradores (nombre, apellido, fecha_nacimiento, sexo, fecha_ingreso, id_departamento, id_cargo, foto_ruta) "
                       f"VALUES ('{nom}', '{ape}', {f_nac}, {sexo_val}, {f_ing}, {d_id}, {c_id}, {foto_ruta});\n")

    print(f"Archivos generados:")
    print(f"   - {archivo_salida_mysql}")
    print(f"   - {archivo_salida_pg}")
    print(f"   - Carpeta '{carpeta_fotos}' con fotos de colaboradores")
    if fotos_copiadas:
        print(f"   - {len(fotos_copiadas)} fotos extraídas")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
