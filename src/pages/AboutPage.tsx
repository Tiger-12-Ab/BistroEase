import React from "react";
import { useTranslation } from "react-i18next";

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-bg-light dark:bg-bg-dark">
      <div className="max-w-6xl mx-auto p-6 sm:p-12 space-y-12 text-text-primary dark:text-text-primary transition-colors duration-300">

        {/* Page Title */}
        <h1 className="text-4xl sm:text-5xl font-bold text-center text-primary dark:text-primary">
          {t("about.title")}
        </h1>
        <p className="text-center text-text-secondary dark:text-text-secondary text-lg">
          {t("about.subtitle")}
        </p>

        {/* Story Section */}
        <section className="grid gap-6 sm:grid-cols-2 items-center">
          <img
            src="/images/restaurant-story.jpg"
            alt="Our Story"
            className="w-full rounded-lg shadow-lg"
          />
          <div>
            <h2 className="text-2xl font-semibold mb-2 text-highlight">
              {t("about.storyTitle")}
            </h2>
            <p className="text-text-secondary dark:text-text-secondary leading-relaxed">
              {t("about.storyContent")}
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="grid gap-6 sm:grid-cols-2">
          <div className="p-6 bg-secondary dark:bg-accent rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2 text-primary dark:text-primary">
              {t("about.missionTitle")}
            </h3>
            <p className="text-text-secondary dark:text-text-secondary">
              {t("about.missionContent")}
            </p>
          </div>
          <div className="p-6 bg-secondary dark:bg-accent rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2 text-primary dark:text-primary">
              {t("about.visionTitle")}
            </h3>
            <p className="text-text-secondary dark:text-text-secondary">
              {t("about.visionContent")}
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-highlight">
            {t("about.teamTitle")}
          </h2>
          <p className="text-text-secondary dark:text-text-secondary max-w-3xl mx-auto leading-relaxed">
            {t("about.teamContent")}
          </p>
        </section>
      </div>
    </section>
  );
};

export default AboutPage;
