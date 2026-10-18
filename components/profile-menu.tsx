"use client";

import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { navButtonClassName, primaryButton, secondaryButton } from "@/components/app-ui";
import { ProfileEmoji } from "@/components/profile-emoji";
import { Button } from "@/components/ui/button";
import {
  EMOJI_PICKER_STRIP_8,
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "@/components/ui/emoji-picker";
import { Input } from "@/components/ui/input";
import { defaultLocale, t } from "@/lib/i18n";
import {
  ANONYMOUS_PROFILE_ID,
  anonymousProfile,
  createProfile,
  deleteProfile,
  profileFromStored,
  setActiveProfileId,
  updateProfile,
  useActiveProfileId,
  useStoredProfilesList,
  type Profile,
} from "@/lib/profile";
import { cn } from "@/lib/utils";

const PLACEHOLDER_EMOJI = "❓";
const PROFILE_EMOJI_PICKER_COLUMNS = 8;

function useActiveProfile(): Profile {
  const activeId = useActiveProfileId();
  const stored = useStoredProfilesList();
  const anonymousUsername = t(defaultLocale, "profile.anonymous");

  if (activeId === ANONYMOUS_PROFILE_ID) {
    return anonymousProfile(anonymousUsername);
  }

  const match = stored.find((p) => p.id === activeId);
  if (!match) return anonymousProfile(anonymousUsername);
  return profileFromStored(match, anonymousUsername);
}

function ProfileNameEmojiForm({
  displayEmoji,
  username,
  onUsernameChange,
  onOpenEmojiPicker,
}: {
  displayEmoji: string;
  username: string;
  onUsernameChange: (value: string) => void;
  onOpenEmojiPicker: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onOpenEmojiPicker}
        className="relative inline-flex size-14 shrink-0 items-center justify-center rounded-2xl ring-1 ring-border transition-colors hover:bg-muted/60"
        aria-label={t(defaultLocale, "profile.editEmoji")}
      >
        <ProfileEmoji emoji={displayEmoji} size="2rem" />
        <span className="absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-card ring-1 ring-border">
          <Pencil className="size-3 text-muted-foreground" aria-hidden />
        </span>
      </button>
      <Input
        id="profile-username"
        value={username}
        onChange={(event) => onUsernameChange(event.target.value)}
        placeholder={t(defaultLocale, "profile.usernamePlaceholder")}
        autoComplete="off"
        maxLength={24}
        className="h-14 min-w-0 flex-1 rounded-2xl text-base"
        aria-label={t(defaultLocale, "profile.usernameLabel")}
      />
    </div>
  );
}

export function ProfileMenu({ className }: { className?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [pickedEmoji, setPickedEmoji] = useState("");

  const active = useActiveProfile();
  const storedProfiles = useStoredProfilesList();
  const activeId = useActiveProfileId();
  const anonymousUsername = t(defaultLocale, "profile.anonymous");

  const inProfileForm = creating || editingId !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function resetForm() {
    setCreating(false);
    setEditingId(null);
    setEmojiPickerOpen(false);
    setUsername("");
    setPickedEmoji("");
  }

  function closeDialog() {
    setOpen(false);
    resetForm();
  }

  function startCreate() {
    resetForm();
    setCreating(true);
  }

  function startEdit(profile: Profile) {
    resetForm();
    setEditingId(profile.id);
    setUsername(profile.username);
    setPickedEmoji(profile.emoji);
  }

  function submitForm() {
    if (editingId) {
      if (!updateProfile(editingId, username, pickedEmoji)) return;
      closeDialog();
      return;
    }
    const created = createProfile(username, pickedEmoji);
    if (!created) return;
    closeDialog();
  }

  function handleProfileClick(profile: Profile, selected: boolean) {
    if (selected) {
      closeDialog();
      return;
    }
    setActiveProfileId(profile.id);
    closeDialog();
  }

  const allChoices: Profile[] =
    storedProfiles.length === 0
      ? [anonymousProfile(anonymousUsername)]
      : storedProfiles.map((p) => profileFromStored(p, anonymousUsername));

  const canSaveProfile = Boolean(username.trim() && pickedEmoji);
  const displayEmoji = pickedEmoji || PLACEHOLDER_EMOJI;

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        onClick={() => setOpen(true)}
        className={cn(
          navButtonClassName,
          "gap-2 px-3 text-primary min-[420px]:max-w-[min(12rem,40vw)] min-[420px]:px-3 aspect-square w-12 min-[420px]:aspect-auto min-[420px]:w-auto",
          className,
        )}
        aria-label={t(defaultLocale, "profile.openMenu", { name: active.username })}
        title={active.username}
      >
        <ProfileEmoji emoji={active.emoji} size="1.35rem" />
        <span className="hidden truncate min-[420px]:inline">{active.username}</span>
      </Button>

      <dialog
        ref={dialogRef}
        aria-labelledby={emojiPickerOpen ? "profile-emoji-picker-title" : "profile-dialog-title"}
        onCancel={(event) => {
          event.preventDefault();
          if (emojiPickerOpen) {
            setEmojiPickerOpen(false);
            return;
          }
          closeDialog();
        }}
        onClick={(event) => {
          if (event.target !== dialogRef.current) return;
          if (emojiPickerOpen) setEmojiPickerOpen(false);
          else closeDialog();
        }}
        className="fixed inset-0 z-50 m-0 max-h-none max-w-none border-0 bg-transparent p-4 backdrop:bg-black/40 open:flex open:items-center open:justify-center"
      >
        <div
          role="document"
          className={cn(
            "relative flex w-full flex-col overflow-hidden rounded-3xl bg-card text-card-foreground ring-1 ring-line",
            emojiPickerOpen
              ? cn("max-h-[min(90vh,36rem)]", EMOJI_PICKER_STRIP_8)
              : "max-h-[min(90vh,40rem)] max-w-lg",
          )}
        >
          {emojiPickerOpen ? (
            <div className="absolute inset-0 z-10 flex flex-col overflow-hidden rounded-3xl bg-card text-card-foreground">
              <div
                className={cn(
                  "mx-auto flex w-full shrink-0 items-center gap-2 border-b border-line px-1 py-2",
                  EMOJI_PICKER_STRIP_8,
                )}
              >
                <h3
                  id="profile-emoji-picker-title"
                  className="min-w-0 flex-1 truncate text-base font-semibold"
                >
                  {t(defaultLocale, "profile.emojiLabel")}
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEmojiPickerOpen(false)}
                  className="size-10 shrink-0 rounded-xl px-0"
                  aria-label={t(defaultLocale, "profile.emojiPickerClose")}
                >
                  <X aria-hidden />
                </Button>
              </div>
              <EmojiPicker
                className={cn(
                  "mx-auto min-h-0 w-full flex-1 rounded-none border-0 shadow-none",
                  EMOJI_PICKER_STRIP_8,
                )}
                columns={PROFILE_EMOJI_PICKER_COLUMNS}
                locale="es"
                onEmojiSelect={(emoji) => {
                  setPickedEmoji(emoji.emoji);
                  setEmojiPickerOpen(false);
                }}
              >
                <EmojiPickerSearch placeholder={t(defaultLocale, "profile.emojiSearch")} />
                <EmojiPickerContent />
                <EmojiPickerFooter />
              </EmojiPicker>
            </div>
          ) : null}
          <div className="border-b border-line px-6 py-5">
            <h2 id="profile-dialog-title" className="text-xl font-semibold">
              {t(defaultLocale, "profile.title")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t(defaultLocale, "profile.subtitle")}
            </p>
          </div>

          <div className="overflow-y-auto px-6 py-4">
            {!inProfileForm ? (
              <ul className="grid gap-2">
                {allChoices.map((profile) => {
                  const selected = profile.id === activeId;
                  const canDelete = !profile.isAnonymous;

                  return (
                    <li key={profile.id}>
                      <div
                        className={cn(
                          "flex items-center gap-2 rounded-2xl ring-1 ring-border transition-colors hover:bg-muted/60",
                          selected && "ring-2 ring-primary",
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => handleProfileClick(profile, selected)}
                          className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-4 py-3 text-left text-foreground"
                        >
                          <ProfileEmoji emoji={profile.emoji} size="1.75rem" />
                          <span className="min-w-0 flex-1 truncate font-medium">
                            {profile.username}
                          </span>
                        </button>
                        {canDelete ? (
                          <div className="mr-2 flex shrink-0 items-center gap-0.5">
                            <button
                              type="button"
                              onClick={() => startEdit(profile)}
                              className="inline-flex size-10 items-center justify-center rounded-xl text-muted-foreground"
                              aria-label={t(defaultLocale, "profile.editProfile", {
                                name: profile.username,
                              })}
                            >
                              <Pencil className="size-4" aria-hidden />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteProfile(profile.id)}
                              className="inline-flex size-10 items-center justify-center rounded-xl text-muted-foreground"
                              aria-label={t(defaultLocale, "profile.delete", {
                                name: profile.username,
                              })}
                            >
                              <Trash2 className="size-4" aria-hidden />
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <ProfileNameEmojiForm
                displayEmoji={displayEmoji}
                username={username}
                onUsernameChange={setUsername}
                onOpenEmojiPicker={() => setEmojiPickerOpen(true)}
              />
            )}
          </div>

          <div className="grid gap-2 border-t border-line px-6 py-4">
            {!inProfileForm ? (
              <>
                <button type="button" onClick={startCreate} className={primaryButton}>
                  <span className="inline-flex items-center justify-center gap-2">
                    <Plus className="size-5" aria-hidden />
                    {t(defaultLocale, "profile.create")}
                  </span>
                </button>
                <button type="button" onClick={closeDialog} className={secondaryButton}>
                  {t(defaultLocale, "profile.close")}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={submitForm}
                  disabled={!canSaveProfile}
                  className={primaryButton}
                >
                  {t(defaultLocale, "profile.save")}
                </button>
                <button type="button" onClick={resetForm} className={secondaryButton}>
                  {t(defaultLocale, "profile.backToList")}
                </button>
              </>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
