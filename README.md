# FaceGold - Aplicación Exclusiva para Millonarios

FaceGold es una aplicación móvil desarrollada con Ionic y Angular, diseñada exclusivamente para personas millonarias que buscan conectarse con otros miembros de élite.

## Características Principales

### 🔐 Login Premium
- Animación única al escribir la contraseña que muestra cómo se oculta
- Diseño elegante y exclusivo
- Validación de formularios

### 📱 Secciones Principales

#### Feeds
- Publicaciones de usuarios verificados
- Sistema de "Esmeraldas" en lugar de likes (representa dinero)
- Interfaz premium con diseño oscuro y dorado
- Comentarios y compartir

#### Reels
- Videos cortos estilo TikTok/Instagram Reels
- Sistema de esmeraldas integrado
- Navegación vertical por reels
- Diseño full-screen inmersivo

#### Perfil/Menu
- Perfil de usuario premium
- Estadísticas (Esmeraldas, Conexiones, Publicaciones)
- Menú de opciones exclusivas
- Verificación premium

## Tecnologías Utilizadas

- **Ionic 7** - Framework móvil
- **Angular 17** - Framework web
- **TypeScript** - Lenguaje de programación
- **SCSS** - Estilos avanzados
- **Angular Animations** - Animaciones fluidas

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Ejecutar la aplicación:
```bash
npm start
```

3. Para desarrollo móvil:
```bash
ionic serve
```

## Estructura del Proyecto

```
facegold/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── login/          # Página de login
│   │   │   ├── feeds/          # Página de feeds
│   │   │   ├── reels/          # Página de reels
│   │   │   └── menu/           # Página de perfil/menu
│   │   ├── tabs/               # Navegación por tabs
│   │   ├── app.component.ts    # Componente principal
│   │   └── app-routing.module.ts
│   ├── assets/                 # Recursos estáticos
│   ├── index.html
│   ├── main.ts
│   └── styles.css              # Estilos globales
├── package.json
├── angular.json
└── ionic.config.json
```

## Características de Diseño

- **Tema Oscuro Premium**: Fondo negro con acentos dorados
- **Esmeraldas**: Sistema de moneda virtual representado por 💎
- **Animaciones Suaves**: Transiciones elegantes en toda la app
- **UI Exclusiva**: Diseño que refleja lujo y exclusividad

## Próximas Mejoras

- Integración con backend
- Sistema de autenticación real
- Chat entre usuarios
- Notificaciones push
- Compartir contenido
- Búsqueda de usuarios

## Licencia

MIT

