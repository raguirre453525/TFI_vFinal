# TFI — Plataforma de comercio electrónico

Aplicación académica de Desarrollo de Software para consultar un catálogo,
registrarse e iniciar sesión, administrar un carrito y crear y consultar pedidos.
Incluye pantallas administrativas para productos y estados de pedidos, una API
con autenticación JWT y persistencia en SQL Server.

**Repositorio:** [raguirre453525/TFI_vFinal](https://github.com/raguirre453525/TFI_vFinal)
(privado; se requiere acceso para clonarlo).

## Tecnologías y estructura

| Área | Tecnologías verificadas en el proyecto |
| --- | --- |
| Backend | C# / .NET 8, ASP.NET Core Web API, Identity y JWT Bearer 8.0.17 |
| Datos | SQL Server; EF Core SQL Server 9.0.6 y herramientas/diseño 9.0.7 |
| Documentación de API | Swagger mediante Swashbuckle 6.6.2 |
| Frontend | React 19.1.1, Vite 7.1.12, React Router 7.9.4, Axios 1.13.2, Tailwind CSS 4.1.14 |

Las versiones del frontend corresponden a `package-lock.json`; `npm ci` instala
ese conjunto de dependencias.

```text
Dsw2025Tpi/                    Backend incluido como carpeta del repositorio
  Dsw2025Tpi.Api/              Controladores, autenticación y configuración
  Dsw2025Tpi.Application/      Servicios y modelos de solicitudes/respuestas
  Dsw2025Tpi.Data/             Repositorios, contexto y migraciones de EF Core
  Dsw2025Tpi.Domain/           Entidades e interfaces
  test/                       Ejemplos de solicitudes y comprobación de arranque
Dsw2025_Unidad5-master/        Frontend React/Vite, organizado por módulos
```

## Requisitos

- Windows con SQL Server Express LocalDB para usar la conexión predeterminada.
  En otros sistemas, configurar una instancia accesible de SQL Server.
- SDK de .NET 8 y runtime de ASP.NET Core 8; disponer solo de un SDK más reciente
  no garantiza que esté instalado el runtime requerido.
- Herramienta `dotnet-ef` 9.0.7 para las migraciones.
- Node.js 22.12 o posterior y npm. Vite también admite Node.js 20 desde 20.19.
- Certificado HTTPS de desarrollo confiable para acceder a la API desde el navegador.

Los siguientes comandos se ejecutan en PowerShell. Clonar el repositorio y abrir
dos terminales: una para el backend y otra para el frontend.

## 1. Configurar y ejecutar el backend

Desde `Dsw2025Tpi/`, configurar una clave JWT aleatoria y exclusiva del entorno,
de al menos 32 bytes UTF-8. No existe una clave ni una cuenta administrativa
predeterminada en el código publicado.

```powershell
$env:Jwt__Key = [System.Net.NetworkCredential]::new('', (Read-Host 'Clave JWT del entorno' -AsSecureString)).Password
```

La variable se aplica solo a esta terminal y sus procesos hijos. Para conservarla
en desarrollo sin incorporarla al repositorio, el proyecto ya admite User Secrets:

```powershell
dotnet user-secrets set "Jwt:Key" "$env:Jwt__Key" --project .\Dsw2025Tpi.Api\Dsw2025Tpi.Api.csproj
```

User Secrets se carga en `Development`, almacena valores fuera del repositorio y
no los cifra. En otros entornos, utilizar variables de entorno o un almacén seguro.

| Configuración | Variable de entorno | Uso |
| --- | --- | --- |
| `Jwt:Key` | `Jwt__Key` | Obligatoria; clave de firma, nunca compartida ni versionada |
| `Jwt:Issuer`, `Jwt:Audience`, `Jwt:ExpireInMinutes` | `Jwt__Issuer`, `Jwt__Audience`, `Jwt__ExpireInMinutes` | Valores no secretos disponibles en `appsettings.json` |
| `ConnectionStrings:Dsw2025TpiEntities` | `ConnectionStrings__Dsw2025TpiEntities` | Opcional para reemplazar LocalDB y la base `Dsw2025Db` |
| `BootstrapAdmin:Email` | `BootstrapAdmin__Email` | Correo de la cuenta administrativa inicial |
| `BootstrapAdmin:UserName` | `BootstrapAdmin__UserName` | Nombre de usuario de esa cuenta |
| `BootstrapAdmin:Password` | `BootstrapAdmin__Password` | Contraseña de esa cuenta; configurar fuera del repositorio |

El administrador inicial es **opcional**: omitir las tres opciones `BootstrapAdmin`
para no crearlo, o proporcionar las tres juntas antes del primer arranque. La
contraseña debe cumplir las reglas de Identity: al menos ocho caracteres, mayúscula,
minúscula, número y símbolo. La configuración incompleta detiene el arranque.
La creación solo se intenta si el correo no existe; no cambia contraseñas ni roles
de cuentas existentes. Retirar estas opciones después de crear el administrador.
La API crea los roles `ADMIN` y `USER` al iniciar, por lo que necesita una base
disponible y con el esquema aplicado incluso sin administrador inicial.

Restaurar y compilar antes de preparar la base:

```powershell
dotnet restore .\Dsw2025Tpi.sln
dotnet build .\Dsw2025Tpi.sln --configuration Debug
dotnet test .\Dsw2025Tpi.sln --configuration Debug --no-build
```

Si `dotnet-ef` no está instalado, instalar la versión correspondiente. Aplicar las
migraciones **explícitamente**: el arranque no ejecuta `Database.Migrate()`.

```powershell
dotnet tool install --global dotnet-ef --version 9.0.7
dotnet dev-certs https --trust
dotnet ef database update --project .\Dsw2025Tpi.Data\Dsw2025Tpi.Data.csproj --startup-project .\Dsw2025Tpi.Api\Dsw2025Tpi.Api.csproj
dotnet run --project .\Dsw2025Tpi.Api\Dsw2025Tpi.Api.csproj --launch-profile https
```

Si ya existe otra versión de `dotnet-ef`, verificar su compatibilidad antes de
modificarla. No aplicar migraciones sobre una base compartida sin revisar el cambio.

- API: `https://localhost:7138` y perfil HTTP en `http://localhost:5142`.
- Swagger: `https://localhost:7138/swagger`, disponible solo en `Development`;
  ambos perfiles locales establecen ese entorno.
- Comprobación básica: `https://localhost:7138/healthcheck`. Este endpoint no
  verifica la conexión a SQL Server.
- Rutas principales: `/api/auth`, `/api/products` y `/api/orders`.

## 2. Ejecutar el frontend

En la segunda terminal, desde `Dsw2025_Unidad5-master/`:

```powershell
npm ci
npm run dev -- --host localhost --port 5173 --strictPort
```

Abrir `http://localhost:5173`. La API permite ese origen exacto mediante CORS;
`127.0.0.1` u otro puerto no son equivalentes para esta configuración.
`.env.development` define `VITE_BACKEND_URL=https://localhost:7138/`.
Axios utiliza esa URL absoluta, por lo que las solicitudes actuales no pasan por
el proxy `/api` de Vite. Confiar en el certificado HTTPS de la API antes de iniciar
sesión. No incluir secretos en variables `VITE_*`: quedan expuestas al navegador.

## Verificación y limitaciones

```powershell
# Desde Dsw2025Tpi/, después de compilar en Debug
powershell -NoProfile -File .\test\Check-StartupConfiguration.ps1

# Desde Dsw2025_Unidad5-master/
npm run lint
npm run build
```

- La solución no contiene proyectos de pruebas: `dotnet test` no ejecuta pruebas
  funcionales. Los archivos JSON de `test/` son ejemplos manuales; algunos tienen
  comentarios y no son JSON estricto.
- La comprobación PowerShell verifica las condiciones de configuración del
  arranque sin conectarse a SQL Server ni crear cuentas; no prueba pedidos ni
  autenticación completa.
- El frontend no tiene un script `npm test`. El lint es una comprobación separada
  y tiene deuda de formato registrada; una compilación exitosa no lo reemplaza.
- El backend mantiene advertencias de nulabilidad y una diferencia de versiones
  de EF Core 9.0.6/9.0.7. No debe interpretarse como una compilación sin advertencias.
- Es un proyecto académico con deuda funcional y de autorización pendiente, no
  una aplicación preparada para producción.

**Seguridad:** antes de reutilizar un entorno anterior, rotar las claves JWT y
credenciales administrativas que hayan estado expuestas, incluidas las presentes
en historiales previos. Retirarlas del código actual no revoca credenciales ni
elimina copias históricas. No versionar secretos, certificados privados ni
configuración local.
