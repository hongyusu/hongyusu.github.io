---
title: "Rehearsing Talks With My Own Cloned Voice"
date: 2026-06-07
tags: [TTS, VoiceCloning, Chatterbox, ClaudeCode, Skills, Presentations, HTML]
excerpt: "Turning a markdown doc into a self-contained rehearsal deck — speaker notes, a presenter window, and read-aloud in a voice cloned from 80 seconds of my own speech. The TTS rabbit hole, the one-line setuptools trap that cost me an hour, and packaging the whole thing as a reusable Claude Code skill."
---

> **Note.** This is about a personal tooling workflow, not any specific work project. The example document is described abstractly; no organisation, client, or internal names appear. The pieces are all off-the-shelf: [Claude Code](https://docs.anthropic.com/en/docs/claude-code), the open-source [Chatterbox](https://github.com/resemble-ai/chatterbox) TTS model, and the browser's Web Speech API.

## The itch

I had a dense internal summary — a long markdown file, lots of tables and code — that I needed to present. I didn't want slides that merely *looked* finished; I wanted to **rehearse**: see speaker notes, a next-slide preview, a timer. And once I had the notes written, a second thought crept in: if I've already written every word I plan to say, why am I the one reading it out loud during practice? Could I have it read *to me* — in my own voice?

That turned into a small rabbit hole. Here's the whole thing.

## Step 1 — a deck that rehearses, not just renders

The base is a single self-contained `deck.html` (no build step, no runtime dependencies) generated from the markdown by one of the [html-anything](https://github.com/nexu-io/html-anything) deck skills. GitHub-dark, monospace, terminal-style code blocks. The part that matters for rehearsal is the **presenter window**: press `S` and a second browser window opens with the current slide, the next slide, the full speaker script, and a running timer. Arrow keys drive it; the audience window stays clean.

Each slide carries its script in an `<aside class="notes">` block — 150–250 words written to be *spoken*, not read: short sentences, contractions, the key claim in bold. That choice turns out to matter later, because those notes become the narration source verbatim.

## Step 2 — read-aloud, the free way

The browser already ships a text-to-speech engine: the **Web Speech API**. Zero setup, zero cost, fully offline, and it fires a `boundary` event on each word — which means you can do karaoke-style highlighting of the script as it speaks. I wired a play/pause button, a speed slider, and a voice picker into the presenter window. `P` toggles it.

For most rehearsal this is genuinely enough. But the macOS system voices, while fine, are unmistakably *system voices*. I wanted mine.

## Step 3 — the TTS landscape in 2026

Before writing any code I looked at where text-to-speech actually stands. The blind-test [TTS Arena](https://huggingface.co/spaces/TTS-AGI/TTS-Arena-V2) leaderboards are the honest way to read this, since naturalness is subjective. A few things I learned:

- The **top of the board is all closed APIs** — Inworld, Google's Gemini TTS, ElevenLabs, and MiniMax's Speech models. Great quality, but you rent them, your audio goes to their servers, and they cost per character.
- **OpenAI has TTS** (`gpt-4o-mini-tts` is even nicely *steerable* — you can instruct tone), but it **cannot clone an arbitrary voice**; you get its preset voices only, by design.
- **MiniMax open-weights its language models but not its speech models** — those are API-only. So "is MiniMax open source?" is *yes for the LLMs, no for TTS*.

For cloning my own voice, locally and for free, the interesting column is the open-weight one: **Fish Speech**, **XTTS-v2**, **Chatterbox**, **F5-TTS**, **OpenVoice**. The standout is [**Chatterbox**](https://github.com/resemble-ai/chatterbox) from Resemble AI — MIT-licensed, clones from about **five seconds** of reference audio, and in the vendor's blind test beat ElevenLabs (~65% preference). Open, local, commercial-safe. Sold.

## Step 4 — cloning the voice

I recorded ~80 seconds of myself talking normally and normalised it to a clean mono WAV:

```bash
ffmpeg -i recording.m4a -ac 1 -ar 24000 -af loudnorm voice_sample.wav
```

Chatterbox itself is a few lines — point it at the reference clip and any text:

```python
from chatterbox.tts import ChatterboxTTS

model = ChatterboxTTS.from_pretrained(device="mps")  # Apple GPU
wav = model.generate(text, audio_prompt_path="voice_sample.wav")
```

A render script pulls the `<aside class="notes">` text out of the deck, chunks each slide's script on sentence boundaries, generates audio for each chunk, stitches them with short silences, and writes `audio/slide-01.mp3 …` next to the deck. On Apple's MPS backend it's roughly 1–2 minutes per slide. A dozen slides gave me about **14 minutes of narration in my own voice**.

Back in the presenter window I added a source dropdown: **Browser voice** (live, with word-highlight) or **My voice (recorded)** (plays the rendered mp3s). Tick *auto* and it reads each slide as you advance — a hands-free teleprompter that sounds like me.

## The trap: one line that cost an hour

The first real run crashed inside model load:

```
TypeError: 'NoneType' object is not callable
```

…on Chatterbox's watermarker. The trail: Chatterbox uses `perth` for watermarking, `perth` imports `pkg_resources`, and **`setuptools` 81+ removed `pkg_resources`**. A fresh install pulls the newest setuptools, the import silently fails, the watermarker class becomes `None`, and model construction blows up far from the actual cause. The fix is a single pin:

```
setuptools<81
```

Writing that down here so the next person Googling the error lands on it.

## Step 5 — make it one command, forever

Doing this once is a project; doing it every time is a chore. So I packaged the whole flow as a **Claude Code skill**. The fragile 700-line deck runtime (navigation, presenter window, both read-aloud engines, themes) is frozen as two template halves — a head and a tail — so the model never regenerates it; it only writes the slide sections in between and concatenates. The narration script ships alongside, and the skill knows where my voice sample lives.

The result is that the entire pipeline collapses to a sentence:

> make a narrated deck from `notes/foo.md` in my voice

and out comes `deck.html` plus an `audio/` folder, ready to rehearse. New talk, new markdown file, same one-liner.

## What I'd tell past me

- **Start with the browser's TTS.** It's free, offline, and good enough that you may never need more. Add the fancy stuff only when you actually want *your* voice.
- **Read the leaderboards, but filter by license.** The best-sounding model and the best-*for-you* model are different questions; "open-weight + self-hostable" is a column the rankings don't show.
- **Pin `setuptools<81`** if you touch the current open-source TTS stack.
- **Package the workflow, not just the output.** The deck is nice; the skill that makes any future deck in one line is the thing that actually changes my behaviour.

The keyboard, for the curious: `S` presenter window · `P` play/pause read-aloud · `T` theme · `←/→` navigate · `O` overview · `F` fullscreen · `R` reset timer.
