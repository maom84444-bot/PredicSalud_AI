import React, { useState } from "react"; // Importa React y el hook useState para manejar estado
// Lista de pacientes ficticios para la demostración
const PACIENTES = [ // Arreglo constante de pacientes
  { id: 1, nombre: "Ana Torres", edad: 54 }, // Paciente 1
  { id: 2, nombre: "Luis Gómez", edad: 67 }, // Paciente 2
  { id: 3, nombre: "Marta Ruiz", edad: 41 }, // Paciente 3
]; // Fin de la lista
// Función que simula el cálculo de riesgo (NO es un modelo médico validado)
function calcularRiesgo(v) { // Recibe los signos vitales
  const f = []; // Lista de factores explicativos (XAI)
  if (v.sis > 140) f.push(["Presión sistólica elevada", 25]); // Suma 25 si la presión es alta
  if (v.fc > 100) f.push(["Frecuencia cardíaca alta", 20]); // Suma 20 si el pulso es alto
  if (v.spo2 < 94) f.push(["SpO2 baja", 30]); // Suma 30 si el oxígeno es bajo
  if (v.glu > 180) f.push(["Glucosa elevada", 15]); // Suma 15 si la glucosa es alta
  if (v.temp > 38) f.push(["Fiebre", 10]); // Suma 10 si hay fiebre
  const total = Math.min(100, f.reduce((a, x) => a + x[1], 0)); // Suma de pesos, máximo 100
  return { total, factores: f }; // Devuelve puntaje y factores
} // Fin de calcularRiesgo
// Devuelve la etiqueta y el color según el puntaje
const nivel = (p) => p >= 60 ? ["CRÍTICO", "#c62828"] : p >= 30 ? ["ALTO", "#ef6c00"] : ["ESTABLE", "#2e7d32"]; // Umbrales de riesgo
// Componente principal de la aplicación
export default function PredicSaludAI() { // Exporta el componente por defecto
  const [pantalla, setPantalla] = useState("login"); // Pantalla actual (P01 a P05)
  const [correo, setCorreo] = useState(""); // Correo institucional escrito
  const [clave, setClave] = useState(""); // Contraseña escrita
  const [paciente, setPaciente] = useState(PACIENTES[0]); // Paciente seleccionado
  const [vitales, setVitales] = useState({ sis: 120, fc: 80, spo2: 97, glu: 100, temp: 36.5 }); // Signos vitales iniciales
  const [resultado, setResultado] = useState(null); // Resultado de la IA
  const [decision, setDecision] = useState(""); // Confirmar o rechazar
  const [justif, setJustif] = useState(""); // Justificación médica
  const cambiar = (k, val) => setVitales({ ...vitales, [k]: Number(val) }); // Actualiza un signo vital
  const evaluar = () => { setResultado(calcularRiesgo(vitales)); setPantalla("resultado"); }; // Calcula y navega a P04
  const generar = () => { if (decision && justif.trim()) setPantalla("reporte"); else alert("Elija una opción y escriba la justificación médica."); }; // Valida y pasa a P05
  const [etq, color] = resultado ? nivel(resultado.total) : ["", "#999"]; // Etiqueta y color del riesgo
  const caja = { background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px #0002", marginBottom: 16 }; // Estilo de tarjeta
  const btn = { background: "#0b6e8a", color: "#fff", border: 0, borderRadius: 8, padding: "10px 18px", cursor: "pointer", margin: "4px 4px 4px 0" }; // Estilo de botón
  const inp = { padding: 8, borderRadius: 6, border: "1px solid #bbb", width: "100%", boxSizing: "border-box", marginBottom: 10 }; // Estilo de campo
  return ( // Inicia el renderizado
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#eef4f7", minHeight: "100vh", padding: 16 }}> {/* Contenedor general */}
      <div style={{ maxWidth: 760, margin: "0 auto" }}> {/* Columna central responsiva */}
        <h2 style={{ color: "#0b6e8a" }}>PredicSalud AI</h2> {/* Título de la app */}
        {pantalla !== "login" && ( // Menú visible solo tras iniciar sesión
          <nav> {/* Barra de navegación */}
            {[["dashboard", "Dashboard"], ["triage", "Triage"], ["resultado", "Resultado IA"], ["reporte", "Reporte"]].map(([k, t]) => ( // Recorre las pantallas
              <button key={k} style={{ ...btn, opacity: pantalla === k ? 1 : 0.6 }} onClick={() => setPantalla(k)}>{t}</button> // Botón de navegación
            ))} {/* Fin del menú */}
          </nav> // Cierra nav
        )} {/* Fin condicional */}
        {pantalla === "login" && ( // P01: Login institucional
          <div style={caja}> {/* Tarjeta de login */}
            <h3>Inicio de sesión institucional</h3> {/* Encabezado */}
            <input style={inp} placeholder="Correo institucional" value={correo} onChange={(e) => setCorreo(e.target.value)} /> {/* Campo correo */}
            <input style={inp} type="password" placeholder="Contraseña" value={clave} onChange={(e) => setClave(e.target.value)} /> {/* Campo clave */}
            <button style={btn} onClick={() => (correo && clave ? setPantalla("dashboard") : alert("Ingrese correo y contraseña"))}>Ingresar</button> {/* Acceso simulado */}
          </div> // Cierra tarjeta
        )} {/* Fin P01 */}
        {pantalla === "dashboard" && ( // P02: Dashboard con KPI
          <div style={caja}> {/* Tarjeta del dashboard */}
            <h3>Dashboard</h3> {/* Encabezado */}
            <p>Pacientes en seguimiento: <b>{PACIENTES.length}</b></p> {/* KPI de pacientes */}
            {PACIENTES.map((p) => ( // Lista de pacientes
              <div key={p.id} style={{ padding: 8, borderBottom: "1px solid #ddd" }}> {/* Fila de paciente */}
                {p.nombre} ({p.edad} años) {/* Datos del paciente */}
                <button style={btn} onClick={() => { setPaciente(p); setPantalla("triage"); }}>Evaluar</button> {/* Selecciona y va a triage */}
              </div> // Cierra fila
            ))} {/* Fin lista */}
          </div> // Cierra tarjeta
        )} {/* Fin P02 */}
        {pantalla === "triage" && ( // P03: Triage con cinco signos vitales
          <div style={caja}> {/* Tarjeta de triage */}
            <h3>Triage: {paciente.nombre}</h3> {/* Paciente actual */}
            {[["sis", "Presión sistólica (mmHg)"], ["fc", "Frecuencia cardíaca (lpm)"], ["spo2", "SpO2 (%)"], ["glu", "Glucosa (mg/dL)"], ["temp", "Temperatura (°C)"]].map(([k, t]) => ( // Cinco campos
              <label key={k}>{t}<input style={inp} type="number" step="0.1" value={vitales[k]} onChange={(e) => cambiar(k, e.target.value)} /></label> // Campo numérico de cada signo
            ))} {/* Fin campos */}
            <button style={btn} onClick={evaluar}>Calcular riesgo con IA</button> {/* Ejecuta la predicción */}
          </div> // Cierra tarjeta
        )} {/* Fin P03 */}
        {pantalla === "resultado" && ( // P04: Resultado IA y XAI
          <div style={caja}> {/* Tarjeta de resultado */}
            {!resultado ? <p>Primero realice un triage.</p> : ( // Si no hay cálculo, avisa
              <> {/* Fragmento */}
                <h3>Riesgo: <span style={{ color }}>{resultado.total}% {etq}</span></h3> {/* Porcentaje y nivel */}
                <h4>Variables explicativas (XAI)</h4> {/* Subtítulo */}
                {resultado.factores.length === 0 && <p>Sin factores de riesgo detectados.</p>} {/* Caso sin factores */}
                {resultado.factores.map(([n, w]) => ( // Barra por factor
                  <div key={n}>{n} ({w}%)<div style={{ background: "#ddd", borderRadius: 6 }}><div style={{ width: `${w * 3}%`, background: color, height: 10, borderRadius: 6 }} /></div></div> // Barra proporcional
                ))} {/* Fin barras */}
                <h4>Validación médica</h4> {/* Subtítulo */}
                <button style={{ ...btn, background: decision === "Confirmada" ? "#2e7d32" : "#777" }} onClick={() => setDecision("Confirmada")}>Confirmar</button> {/* Confirma */}
                <button style={{ ...btn, background: decision === "Rechazada" ? "#c62828" : "#777" }} onClick={() => setDecision("Rechazada")}>Rechazar</button> {/* Rechaza */}
                <textarea style={inp} rows={3} placeholder="Justificación médica (obligatoria)" value={justif} onChange={(e) => setJustif(e.target.value)} /> {/* Justificación obligatoria */}
                <button style={btn} onClick={generar}>Generar reporte</button> {/* Valida y genera */}
              </> // Cierra fragmento
            )} {/* Fin condicional */}
          </div> // Cierra tarjeta
        )} {/* Fin P04 */}
        {pantalla === "reporte" && resultado && ( // P05: Reporte clínico
          <div style={caja}> {/* Tarjeta de reporte */}
            <h3>Reporte clínico</h3> {/* Encabezado */}
            <p><b>Paciente:</b> {paciente.nombre}, {paciente.edad} años</p> {/* Datos del paciente */}
            <p><b>Riesgo IA:</b> {resultado.total}% ({etq})</p> {/* Resultado de la IA */}
            <p><b>Validación:</b> {decision || "Pendiente"}</p> {/* Decisión del médico */}
            <p><b>Justificación:</b> {justif || "N/A"}</p> {/* Texto del médico */}
            <button style={btn} onClick={() => window.print()}>Imprimir / Guardar PDF</button> {/* Imprime con el navegador */}
            <p style={{ fontSize: 12, color: "#777" }}>Prototipo académico: no usar para decisiones clínicas reales.</p> {/* Aviso legal */}
          </div> // Cierra tarjeta
        )} {/* Fin P05 */}
      </div> {/* Fin columna */}
    </div> // Fin contenedor general
  ); // Fin del return
} // Fin del componente
