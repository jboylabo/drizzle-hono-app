;(() => {
  const listEl = document.getElementById('note-list')
  const form = document.getElementById('note-form')
  const idInput = document.getElementById('note-id')
  const titleInput = document.getElementById('note-title')
  const bodyInput = document.getElementById('note-body')
  const submitBtn = document.getElementById('submit-btn')
  const cancelBtn = document.getElementById('cancel-btn')
  const formTitle = document.getElementById('form-title')
  const statusEl = document.getElementById('status')

  if (
    !listEl ||
    !form ||
    !idInput ||
    !titleInput ||
    !bodyInput ||
    !submitBtn ||
    !cancelBtn ||
    !formTitle ||
    !statusEl
  ) {
    return
  }

  function setStatus(msg, isError) {
    statusEl.textContent = msg || ''
    statusEl.classList.toggle('error', Boolean(isError))
  }

  function resetForm() {
    idInput.value = ''
    titleInput.value = ''
    bodyInput.value = ''
    submitBtn.textContent = '作成'
    formTitle.textContent = '新規作成'
    cancelBtn.classList.add('hidden')
  }

  function startEdit(note) {
    idInput.value = note.id
    titleInput.value = note.title
    bodyInput.value = note.body || ''
    submitBtn.textContent = '更新'
    formTitle.textContent = '編集'
    cancelBtn.classList.remove('hidden')
    titleInput.focus()
  }

  async function api(path, options = {}) {
    const res = await fetch(`/api/notes${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    return data
  }

  function renderNotes(notes) {
    listEl.innerHTML = ''
    if (!notes.length) {
      listEl.innerHTML = '<li class="empty">ノートがありません</li>'
      return
    }

    for (const note of notes) {
      const li = document.createElement('li')
      li.className = 'note-item'

      const meta = document.createElement('div')
      meta.className = 'note-meta'
      const title = document.createElement('strong')
      title.textContent = note.title
      const created = document.createElement('span')
      created.className = 'muted'
      created.textContent = note.createdAt ? new Date(note.createdAt).toLocaleString('ja-JP') : ''
      meta.append(title, created)

      const body = document.createElement('p')
      body.className = 'note-body'
      body.textContent = note.body || '（本文なし）'

      const actions = document.createElement('div')
      actions.className = 'notes-actions'

      const editBtn = document.createElement('button')
      editBtn.type = 'button'
      editBtn.className = 'edit-btn'
      editBtn.textContent = '編集'
      editBtn.addEventListener('click', () => startEdit(note))

      const deleteBtn = document.createElement('button')
      deleteBtn.type = 'button'
      deleteBtn.className = 'delete-btn danger'
      deleteBtn.textContent = '削除'
      deleteBtn.addEventListener('click', async () => {
        if (!confirm(`「${note.title}」を削除しますか？`)) return
        try {
          await api(`/${note.id}`, { method: 'DELETE' })
          setStatus('削除しました')
          if (idInput.value === note.id) resetForm()
          await loadNotes()
        } catch (err) {
          setStatus(err.message, true)
        }
      })

      actions.append(editBtn, deleteBtn)
      li.append(meta, body, actions)
      listEl.appendChild(li)
    }
  }

  async function loadNotes() {
    const notes = await api('')
    renderNotes(notes)
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const payload = {
      title: titleInput.value.trim(),
      body: bodyInput.value,
    }
    try {
      if (idInput.value) {
        await api(`/${idInput.value}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        })
        setStatus('更新しました')
      } else {
        await api('', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        setStatus('作成しました')
      }
      resetForm()
      await loadNotes()
    } catch (err) {
      setStatus(err.message, true)
    }
  })

  cancelBtn.addEventListener('click', () => {
    resetForm()
    setStatus('')
  })

  loadNotes().catch((err) => setStatus(err.message, true))
})()
