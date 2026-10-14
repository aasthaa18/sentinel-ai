import {
  CloudUpload,
  File,
  FileText,
  Filter,
  FolderLock,
  Search,
  ShieldCheck,
  Trash2,
  UploadCloud,
} from "lucide-react"
import { ChangeEvent, DragEvent, useRef, useState } from "react"
import {
  Badge,
  Button,
  Card,
  EmptyState,
  IconButton,
  SectionTitle,
  TextInput,
  Toast,
} from "../components/common/UI"
import { PageHeader } from "../components/layout/AppShell"
import { documentService } from "../services/documentService"
import { useAppState } from "../state/AppState"
import type { DocumentRecord } from "../types"

const allowed = [
  "application/pdf",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]

export default function DocumentsPage() {
  const { documents, setDocuments, demoMode } = useAppState()
  const [query, setQuery] = useState("")
  const [dragging, setDragging] = useState(false)
  const [toast, setToast] = useState<{
    message: string
    tone: "success" | "error"
  } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function processFiles(files: FileList | File[]) {
    for (const file of Array.from(files)) {
      if (!allowed.includes(file.type)) {
        setToast({
          message: `${file.name} is not a supported PDF, TXT, or DOCX file.`,
          tone: "error",
        })
        continue
      }
      const temp: DocumentRecord = {
        id: crypto.randomUUID(),
        name: file.name,
        type: file.name
          .split(".")
          .pop()
          ?.toUpperCase() as DocumentRecord["type"],
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        uploadedAt: "Just now",
        status: "uploading",
        permission: "Private",
        progress: 18,
      }
      setDocuments((current) => [...current, temp])
      if (demoMode) {
        setTimeout(
          () =>
            setDocuments((current) =>
              current.map((item) =>
                item.id === temp.id
                  ? { ...item, status: "pending", progress: undefined }
                  : item,
              ),
            ),
          700,
        )
        setToast({
          message:
            "Added to the development queue. No scan result has been fabricated.",
          tone: "success",
        })
      } else {
        try {
          const uploaded = await documentService.upload(file)
          setDocuments((current) =>
            current.map((item) => (item.id === temp.id ? uploaded : item)),
          )
          setToast({
            message: `${file.name} uploaded successfully.`,
            tone: "success",
          })
        } catch {
          setDocuments((current) =>
            current.map((item) =>
              item.id === temp.id
                ? { ...item, status: "failed", progress: undefined }
                : item,
            ),
          )
          setToast({
            message: "Upload failed. The document was not scanned.",
            tone: "error",
          })
        }
      }
    }
  }

  function onDrop(event: DragEvent) {
    event.preventDefault()
    setDragging(false)
    void processFiles(event.dataTransfer.files)
  }
  const filtered = documents.filter((document) =>
    document.name.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div>
      <PageHeader
        eyebrow="Knowledge and documents"
        title="Document Library"
        description="Upload untrusted files for backend inspection, analysis, and permission-aware retrieval."
        action={
          <Button onClick={() => inputRef.current?.click()}>
            <CloudUpload size={17} /> Upload files
          </Button>
        }
      />
      <Card
        className={`upload-zone ${dragging ? "is-dragging" : ""}`}
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDragOver={(event: DragEvent) => event.preventDefault()}
        onDrop={onDrop}
      >
        <div className="upload-illustration">
          <span className="file-float file-one">PDF</span>
          <span className="upload-shield">
            <FolderLock size={44} />
          </span>
          <span className="file-float file-two">TXT</span>
        </div>
        <h2>Drag and drop your files here</h2>
        <p>
          PDF, TXT, or DOCX · Files are treated as untrusted until the backend
          scan completes.
        </p>
        <Button onClick={() => inputRef.current?.click()}>
          <UploadCloud size={18} /> Choose files
        </Button>
        <input
          ref={inputRef}
          className="visually-hidden"
          type="file"
          multiple
          accept=".pdf,.txt,.docx"
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            event.target.files && void processFiles(event.target.files)
          }
        />
      </Card>

      <div className="document-grid">
        <Card className="document-list-card">
          <SectionTitle
            icon={<FileText size={19} />}
            title="Your documents"
            description={`${documents.length} development record${
              documents.length === 1 ? "" : "s"
            }`}
            action={
              <div className="table-tools">
                <label className="table-search">
                  <Search size={16} />
                  <TextInput
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search documents"
                  />
                </label>
                <Button variant="ghost">
                  <Filter size={17} />
                </Button>
              </div>
            }
          />
          {!filtered.length ? (
            <EmptyState
              icon={<File size={28} />}
              title={query ? "No matching documents" : "Your library is empty"}
              description={
                query
                  ? "Try a different search term."
                  : "Upload a PDF, TXT, or DOCX to begin. Scan results appear only after the backend returns them."
              }
              action={
                !query ? (
                  <Button
                    variant="secondary"
                    onClick={() => inputRef.current?.click()}
                  >
                    Choose a file
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="document-table" role="table">
              <div className="table-row table-head" role="row">
                <span>Name</span>
                <span>Status</span>
                <span>Access</span>
                <span>Uploaded</span>
                <span />
              </div>
              {filtered.map((document) => (
                <div className="table-row" role="row" key={document.id}>
                  <span className="file-name">
                    <span className="file-type">{document.type}</span>
                    <span>
                      <strong>{document.name}</strong>
                      <small>{document.size}</small>
                    </span>
                  </span>
                  <span>
                    <Badge
                      tone={
                        document.status === "ready"
                          ? "success"
                          : document.status === "failed"
                            ? "danger"
                            : "warning"
                      }
                    >
                      {document.status}
                    </Badge>
                  </span>
                  <span>
                    <select
                      value={document.permission}
                      onChange={(event) =>
                        setDocuments(
                          documents.map((item) =>
                            item.id === document.id
                              ? {
                                  ...item,
                                  permission: event.target
                                    .value as DocumentRecord["permission"],
                                }
                              : item,
                          ),
                        )
                      }
                    >
                      <option>Private</option>
                      <option>Team</option>
                      <option>Organization</option>
                    </select>
                  </span>
                  <span>{document.uploadedAt}</span>
                  <IconButton
                    label={`Delete ${document.name}`}
                    onClick={() =>
                      setDocuments(
                        documents.filter((item) => item.id !== document.id),
                      )
                    }
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card className="document-security">
          <SectionTitle
            icon={<ShieldCheck size={19} />}
            title="Security overview"
          />
          <div className="overview-ring">
            <ShieldCheck size={31} />
            <strong>
              {documents.filter((item) => item.status === "ready").length}/
              {documents.length}
            </strong>
            <span>backend-scanned</span>
          </div>
          <div className="overview-stat">
            <span>Awaiting scan</span>
            <strong>
              {documents.filter((item) => item.status === "pending").length}
            </strong>
          </div>
          <div className="overview-stat">
            <span>Failed uploads</span>
            <strong>
              {documents.filter((item) => item.status === "failed").length}
            </strong>
          </div>
          <p className="disclaimer">
            No “all clear” claim is shown until a live backend returns a
            completed scan.
          </p>
        </Card>
      </div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  )
}
