import React, { useEffect } from "react";
import { Uploader } from "@inrupt/solid-react-components";
import { Trans, useTranslation } from "react-i18next";
import {
  WelcomeWrapper,
  WelcomeCard,
  WelcomeLogo,
  WelcomeProfile,
  WelcomeDetail,
  WelcomeName,
  ImageWrapper
} from "./welcome.style";
import { ImageProfile } from "@components";
import { errorToaster, storageHelper } from "@utils";

/**
 * Welcome Page UI component, containing the styled components for the Welcome Page
 * Image component will get theimage context and resolve the value to render.
 * @param props
 */
export const WelcomePageContent = props => {
  const { webId, image, updatePhoto, name } = props;
  const { t } = useTranslation();
  const limit = 2100000;

  const init = async document => {
    try {
      const path = await storageHelper.getAppStorage(webId);

      // Fetch the game's path in the pod, based on user's storage settings
      await storageHelper.createInitialFiles(webId);
    } catch (e) {
      /**
       * Check if something fails when we try to create a inbox
       * and show user a possible solution
       */
      if (e.name === "Inbox Error") {
        return errorToaster(e.message, "Error", {
          label: t("errorCreateInbox.link.label"),
          href: t("errorCreateInbox.link.href")
        });
      }

      errorToaster(e.message, "Error");
    }
  };

  useEffect(() => {
    if (webId) init(webId);
  }, [webId]);

  return (
    <WelcomeWrapper data-testid="welcome-wrapper">
      <WelcomeCard className="card">
        <WelcomeLogo data-testid="welcome-logo">
          <img src="img/logo.svg" alt="Inrupt" />
        </WelcomeLogo>
        <WelcomeProfile data-testid="welcome-profile">
          <h3>
            {t("welcome.welcome")}, <WelcomeName>{name}</WelcomeName>
          </h3>
          <ImageWrapper>
            <Uploader
              {...{
                fileBase: webId && webId.split("/card")[0],
                limitFiles: 1,
                limitSize: limit,
                accept: "jpg,jpeg,png",
                errorsText: {
                  sizeLimit: t("welcome.errors.sizeLimit", {
                    limit: `${limit / 1000000}Mbs`
                  }),
                  unsupported: t("welcome.errors.unsupported"),
                  maximumFiles: t("welcome.errors.maximumFiles")
                },
                onError: error => {
                  if (error && error.statusText) {
                    errorToaster(error.statusText, t("welcome.errorTitle"));
                  }
                },
                onComplete: uploadedFiles => {
                  updatePhoto(
                    uploadedFiles[uploadedFiles.length - 1].uri,
                    t("welcome.uploadSuccess"),
                    t("welcome.successTitle")
                  );
                },
                render: props => (
                  <ImageProfile
                    {...{
                      ...props,
                      webId,
                      photo: image,
                      text: t("welcome.upload"),
                      uploadingText: t("welcome.uploadingText")
                    }}
                  />
                )
              }}
            />
          </ImageWrapper>
        </WelcomeProfile>
      </WelcomeCard>
      <WelcomeCard className="card">
        <WelcomeDetail data-testid="welcome-detail">
          <Trans i18nKey="welcome.title">
            <h3>
              title
              <a
                href="https://github.com/inrupt/solid-react-sdk"
                target="_blank"
                rel="noopener noreferrer"
              >
                link
              </a>
            </h3>
          </Trans>
          <Trans i18nKey="welcome.description">
            <p>
              text
              <a
                href="https://solid.inrupt.com/docs/intro-to-linked-data"
                target="_blank"
                rel="noopener noreferrer"
              >
                link
              </a>
              <a
                href="https://solid.inrupt.com/how-it-works"
                target="_blank"
                rel="noopener noreferrer"
              >
                link
              </a>
              text
            </p>
          </Trans>
          <h3>{t("welcome.githubTiitle")}</h3>
          <Trans i18nKey="welcome.githubText">
            <p>
              text
              <a
                href="https://github.com/Arquisoft/viadeSpec"
                target="_blank"
                rel="noopener noreferrer"
              >
                link
              </a>
              <a
                href="https://github.com/Arquisoft/viade_en2a"
                target="_blank"
                rel="noopener noreferrer"
              >
                link
              </a>
              .
            </p>
          </Trans>
        </WelcomeDetail>
      </WelcomeCard>
    </WelcomeWrapper>
  );
};
