import { html, css, internalProperty, property, query } from 'lit-element';
import { styles } from '@uprtcl/common-ui';
import {
  Secured,
  Perspective,
  Evees,
  CREATE_PERSPECTIVE_TAG,
  CreatePerspectiveEvent,
  UpdatePerspectiveDataEvent,
  UPDATE_PERSPECTIVE_DATA_TAG,
} from '@uprtcl/evees';
import { DocumentEditor } from '@uprtcl/documents';

import { ConnectedElement } from '../../services/connected.element';
import { sharedStyles } from '../../styles';

import RestrictedIcon from '../../assets/icons/left.svg';
import CloseIcon from '../../assets/icons/x.svg';
import ShareCard from '../share';

export class DocumentPage extends ConnectedElement {
  @property({ type: String, attribute: 'page-id' })
  pageId: string;

  @internalProperty()
  hasPull = false;

  @internalProperty()
  loading = true;

  @internalProperty()
  readOnly = false;

  @query('#doc-editor')
  documentEditor: DocumentEditor;

  @internalProperty()
  showSnackBar = false;

  eveesPull: Evees;
  privateSectionPerspective: Secured<Perspective>;
  originId: string;

  async firstUpdated() {
    this.privateSectionPerspective = await this.appManager.elements.get(
      '/linkedThoughts/privateSection'
    );

    this.load();
  }

  updated(changedProperties) {
    if (
      changedProperties.has('pageId') &&
      changedProperties.get('pageId') !== undefined
    ) {
      this.load();
    }
  }

  connectedCallback() {
    super.connectedCallback();

    this.addEventListener(CREATE_PERSPECTIVE_TAG, ((
      event: CreatePerspectiveEvent
    ) => {
      event.stopPropagation();
      this.appManager.draftsManager.createPerspective(event.detail);
    }) as EventListener);

    this.addEventListener(UPDATE_PERSPECTIVE_DATA_TAG, ((
      event: UpdatePerspectiveDataEvent
    ) => {
      event.stopPropagation();
      this.appManager.draftsManager.updatePerspective(event.detail, 2000);
    }) as EventListener);
  }

  async load() {
    this.loading = true;

    this.hasPull = false;

    const {
      details,
    } = await this.appManager
      .getDraftEvees()
      .client.getPerspective(this.pageId);
    this.readOnly = details.guardianId !== this.privateSectionPerspective.id;

    const perspective = await this.appManager
      .getDraftEvees()
      .client.store.getEntity(this.pageId);

    if (
      perspective.object.payload.meta &&
      perspective.object.payload.meta.forking
    ) {
      // this page is a fork of another
      this.originId = perspective.object.payload.meta.forking.perspectiveId;
      this.checkOrigin();
    }

    this.loading = false;
  }

  async checkOrigin() {
    this.eveesPull = await this.appManager.compareForks(
      this.pageId,
      this.originId
    );
    const diff = await this.eveesPull.client.diff();
    this.hasPull = diff.updates.length > 0;

    // To show the snackbar
    if (this.hasPull) {
      this.showSnackBar = true;
    }
  }

  async pull() {
    await this.eveesPull.client.flush();
    this.checkOrigin();
    this.documentEditor.reload();
  }

  renderTopNav() {
    return html`<div class="app-action-bar">
      <share-card
        id="share-element"
        uref=${this.pageId}
        from=${this.privateSectionPerspective
          ? this.privateSectionPerspective.id
          : undefined}
      ></share-card>
    </div>`;
  }

  renderSnackBar(type: 'unpushed' | 'pullchanges') {
    const self = this;
    function unpushedChanges() {
      return html`${RestrictedIcon}
        <div>
          You have not pushed, Only pushed content are shared to the blog.
        </div>
        <div class="snackbar-action">Learn more</div>`;
    }

    function pullChanges() {
      return html`
        <div>The origin of this block has been updated</div>
        <div
          class="snackbar-action"
          @click=${() => {
            const resp = confirm('This may overwrite the content of the page.');
            if (resp) {
              self.pull();
              self.showSnackBar = false;
            }
          }}
        >
          Update Now
        </div>
      `;
    }

    return html`<div class="snackbar-cont">
      <div class="snackbar">
        ${(function () {
          switch (type) {
            case 'pullchanges':
              return pullChanges();
            case 'unpushed':
              return unpushedChanges();
          }
        })()}
        <div
          class="snackbar-action"
          @click=${() => {
            this.showSnackBar = false;
          }}
        >
          ${CloseIcon}
        </div>
      </div>
    </div>`;
  }
  render() {
    return html`
      <div class="page-container">
        ${this.renderTopNav()}
        ${this.loading
          ? html`<uprtcl-loading></uprtcl-loading>`
          : html`<documents-editor
              id="doc-editor"
              uref=${this.pageId}
              emit-updates
              .localEvees=${this.appManager.getDraftEvees()}
              ?read-only=${this.readOnly}
            >
            </documents-editor> `}
        ${this.hasPull && this.showSnackBar
          ? this.renderSnackBar('pullchanges')
          : null}
      </div>
    `;
  }
  static get styles() {
    return [
      styles,
      sharedStyles,
      css`
        :host {
          margin: 0 auto;
          width: 100%;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          max-height: 100vh;
          overflow-y: auto;
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
          padding-bottom: 30vmin;
        }
        .app-action-bar {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-bottom: 1rem;
          padding-top: 1rem;
          font-weight: 400;
          font-size: 1.1rem;
        }
        .app-action-bar > * {
          margin: 0 0.5rem;
        }
        .snackbar-cont {
          font-family: 'Inter', sans-serif;
          position: absolute;
          bottom: 10%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #262641;
          box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.15),
            0px 4px 8px rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          animation: slideUp 0.7s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .snackbar-hide {
          animation: slideDown 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes slideUp {
          0% {
            bottom: -5%;
            opacity: 0.3;
          }
          100% {
            bottom: 10%;
            opacity: 1;
          }
        }
        @keyframes slideDown {
          to {
            bottom: 0%;
          }
        }
        .snackbar {
          display: flex;
          justify-content: center;
          align-items: center;
          padding-left: 1rem;
          color: #fafcfe;
        }
        .snackbar > * {
          padding: 0.5rem;
        }
        .snackbar-action {
          padding: 0.5rem 1rem;
          border-left: 1px solid #fff6;
          cursor: pointer;
          transition: all 0.2s ease;
          align-items: center;
          justify-content: center;
          display: flex;
          font-weight: bold;
        }
        .snackbar-action:hover {
          background: #fff3;
        }
      `,
    ];
  }
}
