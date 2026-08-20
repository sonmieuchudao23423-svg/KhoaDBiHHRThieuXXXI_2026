class AudioSynth {
  private ctx: AudioContext | null = null;
  private campfireBufferNode: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleCampfireAmbience(): boolean {
    this.initContext();
    if (!this.ctx) return false;

    if (this.isPlaying) {
      this.stopCampfire();
      return false;
    } else {
      this.startCampfire();
      return true;
    }
  }

  private startCampfire() {
    if (!this.ctx) return;
    try {
      // Create noise for campfire crackle
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        // Crackle noise formula
        output[i] = Math.random() * 2 - 1;
      }

      this.campfireBufferNode = this.ctx.createBufferSource();
      this.campfireBufferNode.buffer = buffer;
      this.campfireBufferNode.loop = true;

      // Filter for warm wood crackle frequency
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200;
      filter.Q.value = 3.0;

      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.value = 0.15;

      this.campfireBufferNode.connect(filter);
      filter.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      this.campfireBufferNode.start();
      this.isPlaying = true;
    } catch (e) {
      console.error('Audio synth error:', e);
    }
  }

  public stopCampfire() {
    if (this.campfireBufferNode) {
      this.campfireBufferNode.stop();
      this.campfireBufferNode.disconnect();
      this.campfireBufferNode = null;
    }
    this.isPlaying = false;
  }

  public playFanfareSound() {
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5 (Scout Horn / Brass chord)
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.value = freq;

        const startTime = now + idx * 0.12;
        noteGain.gain.setValueAtTime(0, startTime);
        noteGain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
        noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2);

        osc.connect(noteGain);
        noteGain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + 1.25);
      });
    } catch (e) {
      console.error('Fanfare synth error:', e);
    }
  }
}

export const audioSynth = new AudioSynth();
