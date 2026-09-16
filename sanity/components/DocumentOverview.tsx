import type { UserViewComponent } from 'sanity/structure'

export const DocumentOverview: UserViewComponent = ({ document, documentId, schemaType }) => {
  const doc = document.displayed || document.published || document.draft
  const title =
    (doc?.title as string) ||
    (doc?.translations as any)?.en?.title ||
    (doc?.slug as any)?.current ||
    'Untitled'

  return (
    <div style={{ padding: '1rem 1.5rem' }}>
      <h2 style={{ margin: '0 0 0.5rem' }}>Document Preview</h2>
      <p>
        <strong>Type:</strong> {schemaType?.name}
      </p>
      <p>
        <strong>Title:</strong> {title}
      </p>
      <p>
        <strong>ID:</strong> {documentId}
      </p>
      {doc?._createdAt && (
        <p>
          <strong>Created:</strong> {new Date(doc._createdAt).toLocaleString()}
        </p>
      )}
    </div>
  )
}