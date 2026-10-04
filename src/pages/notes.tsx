export function NotesPage() {
  return (
    <main class="notes-app">
      <header class="notes-header">
        <h1>Notes</h1>
        <p>Drizzle + PostgreSQL の CRUD をブラウザから操作できます。</p>
      </header>

      <section class="notes-form-panel">
        <h2 id="form-title">新規作成</h2>
        <form id="note-form">
          <input type="hidden" id="note-id" value="" />
          <label>
            タイトル
            <input id="note-title" type="text" required placeholder="タイトル" autocomplete="off" />
          </label>
          <label>
            本文
            <textarea id="note-body" rows={4} placeholder="本文（任意）" />
          </label>
          <div class="notes-actions">
            <button type="submit" id="submit-btn">
              作成
            </button>
            <button type="button" id="cancel-btn" class="secondary hidden">
              キャンセル
            </button>
          </div>
        </form>
        <p id="status" class="status" aria-live="polite" />
      </section>

      <section>
        <h2>一覧</h2>
        <ul id="note-list" class="note-list" />
      </section>

      <script src="/notes-ui.js" defer />
    </main>
  )
}
