'use client';

import {
  createTestJsonb,
  deleteTestJsonb,
  getAllTestJsonb,
  updateTestJsonb,
  type TestJsonbItem,
} from '@/DAL/test-jsonb';
import { useSession, signOut } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';

const EMPTY_JSON = '{\n  \n}';

function stringifyJson(value: unknown): string {
  if (value === undefined || value === null) return EMPTY_JSON;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return EMPTY_JSON;
  }
}

export default function TestJsonbCRUD() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<TestJsonbItem[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [json1Text, setJson1Text] = useState(EMPTY_JSON);
  const [json2Text, setJson2Text] = useState(EMPTY_JSON);
  const [listError, setListError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    setListError(null);
    try {
      const next = await getAllTestJsonb();
      setItems(next as TestJsonbItem[]);
    } catch (e: unknown) {
      setListError(e instanceof Error ? e.message : 'Failed to load items');
    }
  }, []);

  useEffect(() => {
    if (status !== 'authenticated') return;
    refresh();
  }, [status, refresh]);

  const applyItemToForm = (item: TestJsonbItem | undefined) => {
    if (!item) {
      setJson1Text(EMPTY_JSON);
      setJson2Text(EMPTY_JSON);
      return;
    }
    setJson1Text(stringifyJson(item.JSON_1));
    setJson2Text(stringifyJson(item.JSON_2));
  };

  const onSelectId = (id: string) => {
    setSelectedId(id);
    setActionMessage(null);
    setActionError(null);
    if (!id) {
      applyItemToForm(undefined);
      return;
    }
    const item = items.find((i) => i.id === id);
    applyItemToForm(item);
  };

  const parsePayload = (): { JSON_1: unknown; JSON_2: unknown } | null => {
    let JSON_1: unknown;
    let JSON_2: unknown;
    try {
      JSON_1 = JSON.parse(json1Text);
    } catch {
      setActionError('JSON_1 is not valid JSON');
      return null;
    }
    try {
      JSON_2 = JSON.parse(json2Text);
    } catch {
      setActionError('JSON_2 is not valid JSON');
      return null;
    }
    return { JSON_1, JSON_2 };
  };

  const handleSave = async () => {
    setActionMessage(null);
    setActionError(null);
    const payload = parsePayload();
    if (!payload) return;
    setBusy(true);
    try {
      if (selectedId) {
        await updateTestJsonb(selectedId, payload);
        setActionMessage('Updated item');
      } else {
        const created = (await createTestJsonb(payload)) as TestJsonbItem;
        setActionMessage('Created item');
        await refresh();
        if (created?.id) {
          setSelectedId(created.id);
          applyItemToForm(created);
        }
        setBusy(false);
        return;
      }
      await refresh();
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    if (!window.confirm(`Delete item ${selectedId}?`)) return;
    setActionMessage(null);
    setActionError(null);
    setBusy(true);
    try {
      await deleteTestJsonb(selectedId);
      setActionMessage('Deleted item');
      setSelectedId('');
      applyItemToForm(undefined);
      await refresh();
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setBusy(false);
    }
  };

  const handleNew = () => {
    setSelectedId('');
    applyItemToForm(undefined);
    setActionMessage(null);
    setActionError(null);
  };

  if (status === 'loading') return <p>Loading...</p>;
  if (!session || session.error === 'RefreshAccessTokenError') {
    signOut({ callbackUrl: '/login' });
    return null;
  }

  return (
    <div className="flex flex-col gap-6 text-foreground">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span>Item (by id)</span>
          <select
            className="min-w-[20rem] rounded border border-foreground/20 bg-background px-2 py-1.5"
            value={selectedId}
            onChange={(e) => onSelectId(e.target.value)}
            disabled={busy}
          >
            <option value="">New item</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.id}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="rounded border border-foreground/20 px-3 py-1.5 text-sm disabled:opacity-50"
          onClick={handleNew}
          disabled={busy}
        >
          New
        </button>
        <button
          type="button"
          className="rounded border border-foreground/20 px-3 py-1.5 text-sm disabled:opacity-50"
          onClick={() => refresh()}
          disabled={busy}
        >
          Refresh list
        </button>
      </div>

      {listError && <p className="text-sm opacity-80">{listError}</p>}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span>JSON_1</span>
          <textarea
            className="min-h-[16rem] rounded border border-foreground/20 bg-background p-2 font-mono text-xs"
            value={json1Text}
            onChange={(e) => setJson1Text(e.target.value)}
            disabled={busy}
            spellCheck={false}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>JSON_2</span>
          <textarea
            className="min-h-[16rem] rounded border border-foreground/20 bg-background p-2 font-mono text-xs"
            value={json2Text}
            onChange={(e) => setJson2Text(e.target.value)}
            disabled={busy}
            spellCheck={false}
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded border border-foreground/20 px-3 py-1.5 text-sm disabled:opacity-50"
          onClick={handleSave}
          disabled={busy}
        >
          {selectedId ? 'Update' : 'Create'}
        </button>
        <button
          type="button"
          className="rounded border border-foreground/20 px-3 py-1.5 text-sm disabled:opacity-50"
          onClick={handleDelete}
          disabled={busy || !selectedId}
        >
          Delete
        </button>
      </div>

      {actionMessage && <p className="text-sm opacity-80">{actionMessage}</p>}
      {actionError && <p className="text-sm opacity-80">{actionError}</p>}
    </div>
  );
}
