'use client'
import { useState, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Icon } from '@iconify/react'
import Image from 'next/image'

interface CSVRow {
  'BUILDER NAME': string
  'PROJECT NAME': string
  'LAND PARCEL': string
  'PROPERTY TYPE': string
  'TOWERS': string
  'FLOORS': string
  'CONFIG': string
  'SBA': string
  'POSSESSION': string
  'PRICE': string
  'LOCATION': string
  'BROCHURE': string
  'IMAGES': string
  'RERA NUMBER': string
}

interface PreviewRow extends CSVRow {
  slug: string
  imageFiles: File[]          // device-uploaded images for this row
  imagePreviewUrls: string[]  // local object URLs for preview
}

interface UploadResult {
  name: string
  status: 'success' | 'error' | 'skipped'
  message?: string
}

function parseCSV(text: string): CSVRow[] {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []
  const headers = splitCSVLine(lines[0])
  return lines.slice(1).filter(l => l.trim()).map(line => {
    const values = splitCSVLine(line)
    const row: Record<string, string> = {}
    headers.forEach((h, i) => {
      row[h.trim().replace(/^"|"$/g, '')] = (values[i] ?? '').trim().replace(/^"|"$/g, '')
    })
    return row as unknown as CSVRow
  })
}

function splitCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') { inQuotes = !inQuotes }
    else if (ch === ',' && !inQuotes) { result.push(current.trim()); current = '' }
    else { current += ch }
  }
  result.push(current.trim())
  return result
}

function autoSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function parseSBA(sba: string): { min: number | null; max: number | null } {
  if (!sba) return { min: null, max: null }
  const nums = sba.replace(/[sqftSQFT]/g, '').replace(/[^0-9\-\s–to]/gi, ' ')
    .trim().split(/[\s\-–to]+/).map(Number).filter(n => n > 100 && n < 100000)
  return { min: nums[0] ?? null, max: nums[1] ?? null }
}

function mapCategory(type: string): string {
  const t = type.toUpperCase().trim()
  if (t.includes('VILLA')) return 'luxury-villa'
  if (t.includes('PLOT')) return 'plot'
  if (t.includes('OFFICE')) return 'office-space'
  return 'apartment'
}

function mapPossession(p: string): string {
  const lower = p.toLowerCase()
  if (lower.includes('ready')) return 'Ready to Move'
  return 'New Launch'
}

// Parse Google Drive links from IMAGES column (comma-separated)
function parseDriveImageLinks(imagesField: string): string[] {
  if (!imagesField.trim()) return []
  return imagesField.split(',')
    .map(s => s.trim())
    .filter(s => s.startsWith('http'))
}

// Convert Drive open link → direct image URL for embedding
function driveToEmbedUrl(url: string): string {
  const match = url.match(/[?&]id=([^&]+)/)
  if (match) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`
  const match2 = url.match(/\/file\/d\/([^/]+)/)
  if (match2) return `https://drive.google.com/thumbnail?id=${match2[1]}&sz=w800`
  return url
}

function downloadTemplate() {
  const headers = ['BUILDER NAME','PROJECT NAME','LAND PARCEL','PROPERTY TYPE','TOWERS','FLOORS','CONFIG','SBA','POSSESSION','PRICE','LOCATION','BROCHURE','IMAGES','RERA NUMBER']
  const sample = ['Purva','Northen Lights','25 Acres','APARTMENT','8','2B+G+30/31','2BHK, 3BHK, 4BHK','1200 - 4500 Sqft','2031','1.4Cr onwards','KIADB Aerospace Park','https://drive.google.com/open?id=xxx','https://drive.google.com/open?id=img1, https://drive.google.com/open?id=img2','PRM/KA/RERA/1251/309/PR/120326/008523']
  const csv = `${headers.join(',')}\n${sample.map(v => `"${v}"`).join(',')}`
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = 'bangalore-realtors-template.csv'; a.click()
  URL.revokeObjectURL(url)
}

export default function BulkUploadPage() {
  const [step, setStep] = useState<'upload' | 'preview' | 'uploading' | 'done'>('upload')
  const [rows, setRows] = useState<PreviewRow[]>([])
  const [results, setResults] = useState<UploadResult[]>([])
  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [parseError, setParseError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const processFile = (file: File) => {
    setParseError('')
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const text = ev.target?.result as string
        const parsed = parseCSV(text)
        if (parsed.length === 0) { setParseError('No data rows found.'); return }
        if (!parsed[0]['PROJECT NAME'] && !parsed[0]['BUILDER NAME']) {
          setParseError('Could not find required columns. Use the template or your Google Form export.')
          return
        }
        setRows(parsed.map(r => ({ ...r, slug: autoSlug(r['PROJECT NAME']), imageFiles: [], imagePreviewUrls: [] })))
        setStep('preview')
      } catch { setParseError('Failed to parse CSV.') }
    }
    reader.readAsText(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (file) processFile(file)
  }
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.name.endsWith('.csv')) processFile(file)
  }, [])

  // Handle device image upload for a specific row
  const handleRowImages = (rowIdx: number, files: FileList | null) => {
    if (!files) return
    const fileArr = Array.from(files)
    const previewUrls = fileArr.map(f => URL.createObjectURL(f))
    setRows(prev => prev.map((r, i) => i === rowIdx
      ? { ...r, imageFiles: [...r.imageFiles, ...fileArr], imagePreviewUrls: [...r.imagePreviewUrls, ...previewUrls] }
      : r
    ))
  }

  const removeRowImage = (rowIdx: number, imgIdx: number) => {
    setRows(prev => prev.map((r, i) => {
      if (i !== rowIdx) return r
      URL.revokeObjectURL(r.imagePreviewUrls[imgIdx])
      return {
        ...r,
        imageFiles: r.imageFiles.filter((_, j) => j !== imgIdx),
        imagePreviewUrls: r.imagePreviewUrls.filter((_, j) => j !== imgIdx),
      }
    }))
  }

  // Upload device images to Supabase storage, return URLs
  const uploadDeviceImages = async (files: File[]): Promise<string[]> => {
    const urls: string[] = []
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('property-images').upload(path, file)
      if (!error) {
        const { data } = supabase.storage.from('property-images').getPublicUrl(path)
        urls.push(data.publicUrl)
      }
    }
    return urls
  }

  const handleUpload = async () => {
    setStep('uploading')
    setProgress(0)
    const res: UploadResult[] = []

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const name = row['PROJECT NAME']?.trim()
      if (!name) {
        res.push({ name: `Row ${i + 2}`, status: 'skipped', message: 'No project name' })
        setProgress(Math.round(((i + 1) / rows.length) * 100))
        continue
      }

      setProgressLabel(`Importing: ${name}`)

      // 1. Get drive image links from CSV
      const driveLinks = parseDriveImageLinks(row['IMAGES'] ?? '')
      const driveImageUrls = driveLinks.map(driveToEmbedUrl)

      // 2. Upload device images to Supabase storage
      setProgressLabel(`Uploading images: ${name}`)
      const deviceImageUrls = await uploadDeviceImages(row.imageFiles)

      // 3. All image URLs combined: device uploaded first (better quality), then drive
      const allImageUrls = [...deviceImageUrls, ...driveImageUrls]
      const coverImage = allImageUrls[0] ?? null

      const sba = parseSBA(row['SBA'] ?? '')
      const slug = row.slug || autoSlug(name)
      const config = (row['CONFIG'] ?? '').split(',').map(s => s.trim()).filter(Boolean)

      const payload = {
        name, slug,
        developer: row['BUILDER NAME']?.trim() || null,
        category: mapCategory(row['PROPERTY TYPE'] ?? ''),
        location: row['LOCATION']?.trim() || null,
        area: row['LOCATION']?.trim() || null,
        city: 'Bangalore',
        land_parcel: row['LAND PARCEL']?.trim() || null,
        towers: row['TOWERS']?.trim() || null,
        floors: row['FLOORS']?.trim() || null,
        configuration: config,
        carpet_area_min: sba.min, carpet_area_max: sba.max,
        possession_status: mapPossession(row['POSSESSION'] ?? ''),
        target_possession: row['POSSESSION']?.trim() || null,
        price_label: row['PRICE']?.trim() || null,
        price_min: null, price_max: null,
        rera_number: (row['RERA NUMBER'] ?? '').replace(/^[:\s]+/, '').trim() || null,
        brochure_drive_url: row['BROCHURE']?.trim() || null,
        cover_image_url: coverImage,
        map_embed_url: null,
        description: null,
        pros: [], cons: [], amenities_internal: [], amenities_external: [],
        location_highlights: [], video_urls: [], banks_approved: [],
        is_featured: false, is_active: true,
        beds: null, baths: null, area_sqft: null,
        rera_possession: null, litigation: false,
      }

      const { data: upserted, error } = await supabase
        .from('properties')
        .upsert(payload, { onConflict: 'slug' })
        .select('id')
        .single()

      if (error) {
        res.push({ name, status: 'error', message: error.message })
      } else {
        // Insert property_images rows
        if (allImageUrls.length > 0 && upserted?.id) {
          // Clear old images then insert new
          await supabase.from('property_images').delete().eq('property_id', upserted.id)
          await supabase.from('property_images').insert(
            allImageUrls.map((url, order) => ({ property_id: upserted.id, url, sort_order: order }))
          )
        }
        res.push({ name, status: 'success' })
      }

      setProgress(Math.round(((i + 1) / rows.length) * 100))
    }

    setResults(res)
    setProgressLabel('')
    setStep('done')
  }

  const reset = () => {
    // Revoke all preview object URLs
    rows.forEach(r => r.imagePreviewUrls.forEach(u => URL.revokeObjectURL(u)))
    setStep('upload'); setRows([]); setResults([])
    setProgress(0); setParseError('')
    if (fileRef.current) fileRef.current.value = ''
  }

  const success = results.filter(r => r.status === 'success').length
  const errors = results.filter(r => r.status === 'error').length
  const skipped = results.filter(r => r.status === 'skipped').length

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Bulk Upload Properties</h1>
        <p className="text-gray-500 text-sm mt-1">Upload your Google Form CSV — images from Drive links and device uploads both supported.</p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-8">
        {['Upload CSV', 'Review & Images', 'Import'].map((label, i) => {
          const currentIdx = ['upload', 'preview', 'uploading', 'done'].indexOf(step)
          const done = currentIdx > i
          const active = currentIdx === i || (i === 2 && step === 'uploading')
          return (
            <div key={label} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${active ? 'bg-primary text-white' : done ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                {done ? <Icon icon="ph:check" className="text-sm" /> : <span className="w-4 h-4 flex items-center justify-center text-xs">{i + 1}</span>}
                {label}
              </div>
              {i < 2 && <Icon icon="ph:caret-right" className="text-gray-300" />}
            </div>
          )
        })}
      </div>

      {/* ── STEP 1: Upload ── */}
      {step === 'upload' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="font-semibold text-gray-900">Upload your CSV file</h2>
              <p className="text-sm text-gray-500 mt-1">Works with your Google Form export or the template</p>
            </div>
            <button onClick={downloadTemplate} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
              <Icon icon="ph:download-simple" className="text-primary" /> Download Template
            </button>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <p className="text-xs font-semibold text-blue-700 mb-2">CSV columns (matches Google Form):</p>
            <div className="flex flex-wrap gap-1.5">
              {['BUILDER NAME','PROJECT NAME','LAND PARCEL','PROPERTY TYPE','TOWERS','FLOORS','CONFIG','SBA','POSSESSION','PRICE','LOCATION','BROCHURE','IMAGES','RERA NUMBER'].map(col => (
                <span key={col} className="text-xs font-mono bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{col}</span>
              ))}
            </div>
            <p className="text-xs text-blue-500 mt-2">Timestamp and extra columns are ignored. IMAGES column accepts comma-separated Drive links.</p>
          </div>

          <div
            onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'}`}
          >
            <Icon icon="ph:file-csv" className={`text-5xl mx-auto mb-3 ${isDragging ? 'text-primary' : 'text-gray-300'}`} />
            <p className="font-medium text-gray-700">Drop your CSV here or click to browse</p>
            <p className="text-sm text-gray-400 mt-1">Exported from Google Forms or Excel</p>
          </div>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
          {parseError && (
            <div className="mt-4 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <Icon icon="ph:warning-circle" /> {parseError}
            </div>
          )}
        </div>
      )}

      {/* ── STEP 2: Preview + per-row image upload ── */}
      {step === 'preview' && (
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">{rows.length} properties ready</p>
              <p className="text-sm text-gray-500">Add device images per property below, then import</p>
            </div>
            <div className="flex gap-3">
              <button onClick={reset} className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">← Back</button>
              <button onClick={handleUpload} className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition">
                <Icon icon="ph:upload-simple" /> Import {rows.length} Properties
              </button>
            </div>
          </div>

          {rows.map((row, rowIdx) => {
            const driveLinks = parseDriveImageLinks(row['IMAGES'] ?? '')
            const drivePreviewUrls = driveLinks.map(driveToEmbedUrl)
            const totalImages = drivePreviewUrls.length + row.imagePreviewUrls.length
            return (
              <div key={rowIdx} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-semibold text-gray-900">{row['PROJECT NAME']}</p>
                    <p className="text-sm text-gray-500">{row['BUILDER NAME']} · {row['LOCATION']} · {row['PRICE']}</p>
                    <div className="flex gap-2 mt-1.5 flex-wrap">
                      {row['CONFIG'].split(',').map(c => (
                        <span key={c} className="text-xs bg-gray-100 px-2 py-0.5 rounded">{c.trim()}</span>
                      ))}
                      {row['POSSESSION'] && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{row['POSSESSION']}</span>}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{totalImages} image{totalImages !== 1 ? 's' : ''}</span>
                </div>

                {/* Image gallery: drive + device */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {/* Drive images (from CSV) */}
                  {drivePreviewUrls.map((url, idx) => (
                    <div key={`drive-${idx}`} className="relative w-20 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-0.5">Drive</div>
                    </div>
                  ))}
                  {/* Device images */}
                  {row.imagePreviewUrls.map((url, imgIdx) => (
                    <div key={`device-${imgIdx}`} className="relative w-20 h-16 rounded-lg overflow-hidden border border-primary/40 flex-shrink-0 group">
                      <Image src={url} alt="" fill className="object-cover" unoptimized />
                      <button
                        type="button"
                        onClick={() => removeRowImage(rowIdx, imgIdx)}
                        className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs items-center justify-center hidden group-hover:flex"
                      >×</button>
                      <div className="absolute bottom-0 left-0 right-0 bg-primary/70 text-white text-xs text-center py-0.5">Device</div>
                    </div>
                  ))}
                  {/* Add images button */}
                  <label className="w-20 h-16 rounded-lg border-2 border-dashed border-gray-200 hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer transition flex-shrink-0">
                    <Icon icon="ph:plus" className="text-gray-400 text-lg" />
                    <span className="text-xs text-gray-400">Add</span>
                    <input
                      type="file" accept="image/*" multiple className="hidden"
                      onChange={e => handleRowImages(rowIdx, e.target.files)}
                    />
                  </label>
                </div>

                {driveLinks.length === 0 && row.imageFiles.length === 0 && (
                  <p className="text-xs text-orange-500 flex items-center gap-1">
                    <Icon icon="ph:warning" /> No images — add from device or ensure IMAGES column has Drive links
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── STEP 3: Uploading ── */}
      {step === 'uploading' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <Icon icon="ph:circle-notch" className="text-primary text-3xl animate-spin" />
          </div>
          <p className="font-semibold text-gray-900 text-lg mb-1">Importing properties...</p>
          {progressLabel && <p className="text-gray-400 text-sm mb-4">{progressLabel}</p>}
          <p className="text-primary font-bold text-2xl mb-4">{progress}%</p>
          <div className="w-full bg-gray-100 rounded-full h-2.5 max-w-sm mx-auto">
            <div className="bg-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* ── STEP 4: Done ── */}
      {step === 'done' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="ph:check-circle" className="text-green-500 text-4xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Import Complete</h2>
            <div className="flex justify-center gap-8 mt-4">
              <div><p className="text-3xl font-bold text-green-600">{success}</p><p className="text-xs text-gray-500">Imported</p></div>
              <div><p className="text-3xl font-bold text-red-500">{errors}</p><p className="text-xs text-gray-500">Failed</p></div>
              <div><p className="text-3xl font-bold text-gray-400">{skipped}</p><p className="text-xs text-gray-500">Skipped</p></div>
            </div>
          </div>
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto mb-6">
            {results.map((r, i) => (
              <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm ${r.status === 'success' ? 'bg-green-50 text-green-800' : r.status === 'error' ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-500'}`}>
                <Icon icon={r.status === 'success' ? 'ph:check-circle-fill' : r.status === 'error' ? 'ph:x-circle-fill' : 'ph:minus-circle'} className="flex-shrink-0" />
                <span className="font-medium flex-1 truncate">{r.name}</span>
                {r.message && <span className="text-xs opacity-75 truncate max-w-48">{r.message}</span>}
              </div>
            ))}
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={reset} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition">Upload Another File</button>
            <a href="/admin/properties" className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition">View All Properties →</a>
          </div>
        </div>
      )}
    </div>
  )
}
