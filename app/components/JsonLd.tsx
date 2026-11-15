/** Strukturierte Daten (schema.org) als <script type="application/ld+json">. */
export function JsonLd({data}: {data: unknown}) {
  return (
    <script
      type="application/ld+json"
      // </script> im Text unschädlich machen
      dangerouslySetInnerHTML={{__html: JSON.stringify(data).replace(/</g, '\\u003c')}}
    />
  );
}
