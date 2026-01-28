import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCases, createCase } from "@/lib/api";
import { Plus, Image, Film, ArrowRight } from "lucide-react";

export default function AdminCasesList() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newSlug, setNewSlug] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    getCases().then((r) => {
      setLoading(false);
      if (r.success && r.data) setList(r.data);
      else setError(r.message || "Ошибка загрузки");
    });
  }, []);

  const handleCreate = async () => {
    if (!newSlug.trim() || !newTitle.trim()) return;
    setCreating(true);
    const r = await createCase({ slug: newSlug.trim(), title: newTitle.trim() });
    setCreating(false);
    if (r.success && r.data) {
      setShowAdd(false);
      setNewSlug("");
      setNewTitle("");
      setList((prev) => [...prev, r.data]);
      window.location.href = `/admin/cases/${r.data.id}`;
    } else {
      setError(r.message || "Ошибка");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Кейсы</h1>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15"
          >
            <Plus className="w-4 h-4" />
            Добавить кейс
          </button>
        </div>

        {showAdd && (
          <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-sm text-white/70 mb-3">Новый кейс</p>
            <div className="flex flex-wrap gap-3">
              <input
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                placeholder="slug (латиница, дефисы)"
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white w-48"
              />
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Название"
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white flex-1 min-w-[200px]"
              />
              <button
                onClick={handleCreate}
                disabled={creating}
                className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-medium disabled:opacity-50"
              >
                {creating ? "…" : "Создать"}
              </button>
              <button
                onClick={() => { setShowAdd(false); setNewSlug(""); setNewTitle(""); }}
                className="px-4 py-2 rounded-lg border border-white/20"
              >
                Отмена
              </button>
            </div>
          </div>
        )}

        {error && <p className="text-red-400 mb-4">{error}</p>}
        {loading && <p className="text-white/60">Загрузка…</p>}

        {!loading && list.length === 0 && !showAdd && (
          <p className="text-white/60">Нет кейсов. Создайте первый.</p>
        )}

        <div className="space-y-2">
          {list.map((c) => (
            <Link
              key={c.id}
              to={`/admin/cases/${c.id}`}
              className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-white/50 font-mono text-sm">{c.slug}</span>
                <span className="font-medium">{c.title}</span>
                {c.cover && <Image className="w-4 h-4 text-cyan-400" />}
                {c.video && <Film className="w-4 h-4 text-violet-400" />}
              </div>
              <ArrowRight className="w-4 h-4 text-white/40" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
