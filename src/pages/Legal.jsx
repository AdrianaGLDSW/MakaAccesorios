import { NavLink, useParams } from 'react-router-dom';
import { LEGAL } from '../data/contenido';
import { useTitulo } from '../hooks/useLocalStorage';
import { Breadcrumbs } from '../components/ui';
import NotFound from './NotFound';
import '../styles/info.css';

export default function Legal() {
  const { seccion } = useParams();
  const doc = LEGAL[seccion];
  useTitulo(doc?.titulo || 'Información legal');
  if (!doc) return <NotFound />;
  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: 'Información legal' }, { label: doc.titulo }]} />
      <div className="legal">
        <nav className="legal__nav" aria-label="Documentos legales">
          {Object.entries(LEGAL).map(([k, d]) => <NavLink key={k} to={`/legal/${k}`}>{d.titulo}</NavLink>)}
        </nav>
        <article className="legal__doc">
          <h1>{doc.titulo}</h1>
          <p className="muted small">Última actualización: {doc.actualizado}</p>
          <nav className="legal__toc" aria-label="Contenido"><ol>{doc.secciones.map((s, i) => <li key={i}><a href={`#s${i}`}>{s.t}</a></li>)}</ol></nav>
          {doc.secciones.map((s, i) => <section key={i} id={`s${i}`}><h2>{s.t}</h2><p>{s.p}</p></section>)}
        </article>
      </div>
    </div>
  );
}
