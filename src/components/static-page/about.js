import React from 'react';
import Link from '../link';

import logoMisereor from '../../img/misereor-logo.jpg';
import logoProHabitat from '../../img/pro-habitat-logo.jpg';

const AboutContent = () =>
  <div className="static-page-content about">
      <h1>DATEA - TODOS SOMOS DATEROS</h1>

      <p>Datea es una plataforma de mapeo colaborativo para la recolección
        y visualición de información (dateos) por parte de la ciudadanía. Los usuarios
        de Datea (dateros) crean dateos agrupados en hashtags y mapeos, visualizando
        la información en mapas y galerías de imágenes. Colectivos y organizaciones de
        la sociedad civil pueden organizar campañas de recolección de información creando un mapeo,
        e involucrar a la ciudadanía en sus campañas.</p>

      <p>Datea, también conocida como "Todos Somos Dateros", nace inspirada en la figura del "datero",
        personaje del ámbito urbano limeño que se gana la vida en la esquinas, dándole información a
        los micros sobre la frecuencia en la que van pasando las líneas. De esta manera, el sistema de
        transporte informal se autoregula bajo un esquema bottom up, ante la falta de control e iniciativa
        por parte del estado. Datea permite a sus usuarios convertirse en "dateros", y aportar información
        útil para su comunidad o alguna iniciativa específica.</p>

      <p><strong>No eres dater@? <Link view="register">Regístrate!</Link></strong></p>

      <p>Datea ha sido apoyado por:</p>
      <p>
        <a className="logo" href="http://www.avinaamericas.org/">
          <img src="http://www.informeavina2010.org/english/images/Logo_avinas_americas.gif" alt="Avina Americas" />
        </a>
      </p>
      <p className="logo-row">
        <img className="pro-habitat" src={logoProHabitat} alt="Pro Habitat" />
        <img className="misereor" src={logoMisereor} alt="Misereor" />
      </p>
  </div>

export default AboutContent;
