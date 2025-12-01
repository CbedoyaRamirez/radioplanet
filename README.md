# Radio Planet 🌍📻

Una aplicación móvil interactiva estilo Radio Garden construida con Ionic y Angular, que permite explorar y escuchar emisoras de radio de todo el mundo a través de un globo terráqueo 3D interactivo.

## 🎯 Características

- **Globo Terráqueo 3D Interactivo**: Explora el mundo con un globo 3D renderizado con Three.js
- **Puntos Verdes de Emisoras**: Visualiza emisoras de radio de diferentes ciudades alrededor del mundo
- **Reproducción en Vivo**: Escucha emisoras de radio en tiempo real directamente desde la aplicación
- **Interfaz Minimalista**: Diseño limpio y moderno inspirado en Radio Garden
- **Rotación Suave**: El globo rota automáticamente cuando no está siendo manipulado
- **Fondo Estrellado**: Ambiente espacial con estrellas animadas de fondo
- **Panel Inferior Compacto**: Información de la emisora seleccionada en un panel inferior elegante
- **Responsive**: Diseño adaptativo para dispositivos móviles y tablets

## 🚀 Tecnologías Utilizadas

- **Ionic**: Framework para aplicaciones móviles híbridas
- **Angular**: Framework de desarrollo web
- **Three.js**: Biblioteca 3D para renderizar el globo terráqueo
- **TypeScript**: Lenguaje de programación tipado
- **SCSS**: Preprocesador CSS para estilos avanzados

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/CbedoyaRamirez/radioplanet.git
cd radioplanet
```

2. Instala las dependencias:
```bash
npm install
```

3. Ejecuta la aplicación en modo desarrollo:
```bash
ionic serve
```

## 🏗️ Construcción

Para construir la aplicación para producción:

```bash
npm run build
```

## 📱 Uso

1. **Explorar el Globo**: Arrastra el globo con el mouse o el dedo para rotarlo y explorar diferentes ubicaciones
2. **Hacer Zoom**: Usa la rueda del mouse o pellizca para hacer zoom
3. **Seleccionar Emisora**: Haz clic en un punto verde para seleccionar una emisora
4. **Reproducir Radio**: Haz clic en el botón de play en el panel inferior para comenzar a escuchar
5. **Pausar**: Haz clic nuevamente en el botón para pausar la reproducción

## 🎨 Características de Diseño

- **Panel Inferior**: Aparece automáticamente cuando se selecciona una emisora
- **Botón de Play/Pause**: Botón circular que cambia de blanco a verde cuando está reproduciendo
- **Indicador de Ondas**: Animación de ondas de sonido cuando la radio está reproduciendo
- **Fondo Negro**: Diseño minimalista con fondo negro puro
- **Estrellas Animadas**: Efecto de parpadeo sutil en las estrellas de fondo

## 📂 Estructura del Proyecto

```
facegold/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── globe/          # Página principal del globo
│   │   │   └── login/           # Página de inicio de sesión
│   │   ├── app.component.ts
│   │   └── app-routing.module.ts
│   └── styles.css
├── package.json
└── README.md
```

## 🔧 Configuración

La aplicación está configurada para:
- Redirección automática al globo después del login
- Rotación automática del globo cuando está inactivo
- Zoom con límites configurables
- Reproducción de audio HTML5 para streams de radio

## 📝 Notas

- Las emisoras de radio requieren URLs de streaming válidas
- Algunas emisoras pueden tener restricciones CORS
- La aplicación funciona mejor en dispositivos con soporte WebGL

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

Desarrollado con ❤️ para explorar el mundo a través de la radio.

---

**Radio Planet** - Conectando el mundo a través de las ondas de radio 🌍📻
