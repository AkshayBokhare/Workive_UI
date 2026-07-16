import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { X, ImagePlus } from 'lucide-react'
import { Textarea } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/layout/PageHeader'
import { apiErrorMessage } from '../api/client'
import * as postsApi from '../api/posts'

export default function CreatePost() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const fileInputRef = useRef(null)
  const [caption, setCaption] = useState('')
  const [files, setFiles] = useState([])

  const previews = files.map((f) => ({ file: f, url: URL.createObjectURL(f) }))

  function addFiles(fileList) {
    setFiles((prev) => [...prev, ...Array.from(fileList)].slice(0, 10))
  }

  const mutation = useMutation({
    mutationFn: (publish) => postsApi.createPost({ caption, publish, files }),
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      queryClient.invalidateQueries({ queryKey: ['posts', 'me'] })
      navigate(`/posts/${post.id}`)
    },
  })

  return (
    <div className="mx-auto max-w-2xl px-8 py-8">
      <PageHeader title="New post" backTo="/" backLabel="Cancel" />

      <Card className="p-6">
        <div
          className="flex flex-col gap-4"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            addFiles(e.dataTransfer.files)
          }}
        >
          <div className="grid grid-cols-4 gap-2">
            {previews.map((p, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-ink-100">
                {p.file.type.startsWith('video') ? (
                  <video src={p.url} className="h-full w-full object-cover" muted />
                ) : (
                  <img src={p.url} alt="" className="h-full w-full object-cover" />
                )}
                <button
                  onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink-900/70 text-white"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
            {files.length < 10 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-ink-300 text-ink-400 hover:border-honey-300 hover:text-honey-600"
              >
                <ImagePlus size={22} />
                <span className="text-xs">Add media</span>
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />

          <Textarea
            label="Caption"
            placeholder="Write a caption..."
            rows={4}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          {mutation.isError && <p className="text-sm text-coral-600">{apiErrorMessage(mutation.error)}</p>}

          <div className="flex justify-end gap-2 border-t border-ink-100 pt-5">
            <Button
              variant="outline"
              size="lg"
              disabled={files.length === 0}
              loading={mutation.isPending && mutation.variables === false}
              onClick={() => mutation.mutate(false)}
            >
              Save draft
            </Button>
            <Button
              size="lg"
              disabled={files.length === 0}
              loading={mutation.isPending && mutation.variables === true}
              onClick={() => mutation.mutate(true)}
            >
              Publish
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
