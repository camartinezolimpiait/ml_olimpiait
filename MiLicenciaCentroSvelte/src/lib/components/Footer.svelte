<!--
  Componente de pie de página.
  Migrado desde Angular: src/app/components/common/footer/footer.component
-->
<script lang="ts">
  import { rutas } from '$lib/const/rutas';

  const paginasCliente = rutas.mlCliente.tramites;
  const procesosBanco = rutas.mlCliente.procesosBanco;
</script>

<footer class="footer">
  <div class="wrapper">
    <div class="links-footer">
      <ul>
        <li><strong>Servicio al cliente</strong></li>
        <li>
          <a
            href="https://olimpiait.com/wp-content/uploads/2022/03/POL-022-POLITICA-DE-PROTECCION-DE-DATOS-PERSONALES-1.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Política de protección de datos
          </a>
        </li>
        <li>
          <a href="{paginasCliente.nombre}/{paginasCliente.acciones.faq}">
            Preguntas frecuentes
          </a>
        </li>
        <li>
          <a href="{procesosBanco.nombre}{procesosBanco.acciones.devoluciones}">
            Devoluciones para CRC
          </a>
          o
          <a href="{procesosBanco.nombre}{procesosBanco.acciones.devolucionesCEA}">CEA</a>
        </li>
        <li>
          <a href="{procesosBanco.nombre}{procesosBanco.acciones.cambioDocumento}">
            Corregir documento para CRC
          </a>
          o
          <a href="{procesosBanco.nombre}{procesosBanco.acciones.cambioDocumentoCEA}">CEA</a>
        </li>
      </ul>
      <ul>
        <li><strong>Portales relacionados</strong></li>
        <li>
          <a href="https://www.supertransporte.gov.co/" rel="noopener noreferrer" target="_blank">
            Superintendencia de transporte
          </a>
        </li>
        <li>
          <a href="https://www.mintransporte.gov.co/" rel="noopener noreferrer" target="_blank">
            Ministerio de transporte
          </a>
        </li>
        <li>
          <a href="https://www.runt.com.co/" rel="noopener noreferrer" target="_blank">RUNT</a>
        </li>
        <li>
          <a href="https://consulta.simit.org.co/Simit/" rel="noopener noreferrer" target="_blank"
            >SIMIT</a
          >
        </li>
      </ul>
    </div>
    <hr />
    <div class="derechos">
      <span>Un servicio de </span>
      <a class="logotipo" href="https://www.olimpiait.com/" target="_blank" rel="noopener noreferrer">
        <img src="/assets/img/svg/olimpia-footer.svg" alt="Olimpia IT" />
      </a>
    </div>
  </div>
</footer>

<style>
  .footer {
    background-color: #1565c0;
    color: white;
    padding: 2rem 1rem;
  }

  .wrapper {
    max-width: 1200px;
    margin: 0 auto;
  }

  .links-footer {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 0.5rem;
  }

  a {
    color: #bbdefb;
    text-decoration: none;
  }

  a:hover {
    color: white;
    text-decoration: underline;
  }

  .derechos {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .logotipo img {
    height: 24px;
  }
</style>
