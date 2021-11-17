import "./challenges-header.js";
import "./challenge-grid.js";
import "./challenge-box.js";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";

Vue.component("infinity-challenges-tab", {
  components: {
    "infinity-challenge-box": {
      components: {
        DescriptionDisplay,
        EffectDisplay
      },
      props: {
        challengeId: Number
      },
      data() {
        return {
          isUnlocked: false,
          isRunning: false,
          isCompleted: false
        };
      },
      computed: {
        challenge() {
          return InfinityChallenge(this.challengeId);
        },
        config() {
          return this.challenge.config;
        },
        name() {
          return `IC${this.challengeId}`;
        }
      },
      methods: {
        update() {
          const challenge = this.challenge;
          this.isUnlocked = challenge.isUnlocked;
          this.isRunning = challenge.isRunning;
          this.isCompleted = challenge.isCompleted;
        }
      },
      template:
        `<challenge-box
          :name="name"
          :isUnlocked="isUnlocked"
          :isRunning="isRunning"
          :isCompleted="isCompleted"
          class="c-challenge-box--infinity"
          @start="challenge.requestStart()"
        >
          <template slot="top">
            <DescriptionDisplay :config="config" />
            <EffectDisplay
              v-if="isRunning"
              :config="config"
            />
          </template>
          <div slot="bottom" class="l-challenge-box__bottom--infinity">
            <span>Goal: {{ format(config.goal) }} antimatter</span>
            <DescriptionDisplay
              :config="config.reward"
              label="Reward:"
            />
            <EffectDisplay
              v-if="isCompleted"
              :config="config.reward"
            />
          </div>
        </challenge-box>`
    }
  },
  data() {
    return {
      nextIC: 0,
      showAllChallenges: false
    };
  },
  computed: {
    nextAtDisplay() {
      const first = this.nextIC?.id === 1;
      const next = InfinityChallenges.nextICUnlockAM;

      if (first) return `The first Infinity Challenge unlocks at ${format(next)} antimatter.`;
      return next === undefined
        ? "All Infinity Challenges unlocked"
        : `Next Infinity Challenge unlocks at ${format(next)} antimatter.`;
    }
  },
  methods: {
    update() {
      this.nextIC = InfinityChallenges.nextIC;
      this.showAllChallenges = player.options.showAllChallenges;
    },
    isChallengeVisible(id) {
      return InfinityChallenge(id).isUnlocked || (this.showAllChallenges && PlayerProgress.eternityUnlocked());
    }
  },
  template: `
    <div class="l-challenges-tab">
      <challenges-header />
      <div>
        An active Big Crunch Autobuyer will Crunch immediately when
        reaching an Infinity Challenge's antimatter goal, regardless of settings.
      </div>
      <div>{{ nextAtDisplay }}</div>
      <challenge-grid :count="8" :isChallengeVisible="isChallengeVisible">
        <infinity-challenge-box slot-scope="slotProps" :challengeId="slotProps.challengeId" />
      </challenge-grid>
    </div>`
});
