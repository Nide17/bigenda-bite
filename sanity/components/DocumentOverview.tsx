import type { UserViewComponent } from 'sanity/structure'

type Doc = {
  title?: string
  translations?: { en?: { title?: string } }
  slug?: { current?: string }
  _createdAt?: string
}

export const DocumentOverview: UserViewComponent = ({ document, documentId, schemaType }) => {
  const doc = (document.displayed || document.published || document.draft) as Doc | null
  const title =
    doc?.title ||
    doc?.translations?.en?.title ||
    doc?.slug?.current ||
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