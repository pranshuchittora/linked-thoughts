import { html, css, internalProperty, LitElement, property } from 'lit-element';

import { styles } from '@uprtcl/common-ui';
import { Logger } from '@uprtcl/evees';

import { EveesHttp } from '@uprtcl/evees-http';
import { Router } from '@vaadin/router';

import { Home } from '../constants/routeNames';
import { ConnectedElement } from '../services/connected.element';
import { AUTH0_CONNECTION, ETH_ACCOUNT_CONNECTION } from '../services/init';
import { HttpMultiConnection } from '@uprtcl/http-provider';
import TreesBackground from '../assets/trees.png';
import IntercreativityLogo from '../assets/intercreativity.svg';
import GoogleIcon from '../assets/icons/google.svg';
import FBIcon from '../assets/icons/facebook.svg';
import MetamaskIcon from '../assets/icons/metamask.svg';
import Home1Background from '../assets/illustrations/home-1.svg';
import Home21Background from '../assets/illustrations/home-2-1.svg';
import Home22Background from '../assets/illustrations/home-2-2.svg';
import Home3Background from '../assets/illustrations/home-3.svg';
import Home4Background from '../assets/illustrations/home-4.svg';

export class GettingStartedElement extends ConnectedElement {
  logger = new Logger('Dashboard');

  @internalProperty()
  loading = true;

  @internalProperty()
  isLogged = false;

  @internalProperty()
  hasWeb3 = false;

  @property()
  carouselSelectedIndex: number = 0;

  carouselSelectedIndexIntervel;

  remote: EveesHttp;

  async firstUpdated() {
    this.hasWeb3 = window['ethereum'] !== undefined;
    this.remote = this.evees.getRemote() as EveesHttp;
    this.isLogged = await this.remote.isLogged();

    if (this.isLogged) {
      Router.go(Home);
    }

    this.loading = false;
  }

  connectedCallback() {
    const self = this;
    super.connectedCallback();
    this.carouselSelectedIndexIntervel = setInterval(() => {
      self.carouselSelectedIndex = (self.carouselSelectedIndex + 1) % 4;
    }, 5000);
  }
  disconnectedCallback() {
    clearInterval(this.carouselSelectedIndexIntervel);
  }
  async login(connectionId: string) {
    const multiConnection: HttpMultiConnection = this.remote.connection as any;

    multiConnection.select(connectionId);
    const connection = multiConnection.connection();
    await connection.login();

    this.isLogged = await this.remote.isLogged();
    Router.go(Home);
  }

  render() {
    if (this.loading) return html` <uprtcl-loading></uprtcl-loading> `;

    return html`
      <div class="root">
        <div class="login-cont">
          ${IntercreativityLogo}

          <div class="login-card">
            <h1>Log In</h1>
            <div
              class="loginButton"
              @click=${() => this.login(AUTH0_CONNECTION)}
            >
              Continue with social networks (${GoogleIcon},${FBIcon})
            </div>
            <div
              class="loginButton"
              ?disabled=${!this.hasWeb3}
              @click=${() => this.login(ETH_ACCOUNT_CONNECTION)}
            >
              Continue with Etherum (${MetamaskIcon})
            </div>

            ${!this.hasWeb3
              ? html`<a target="_blank" href="https://metamask.io/"
                  >What’s this?</a
                >`
              : ''}
          </div>
        </div>

        <div>
          <ui5-carousel
            class="carousel-cont"
            cyclic="true"
            selected-index=${this.carouselSelectedIndex}
          >
            <div class="carousel-item">
              <div class="bkg-illustration right top">${Home1Background}</div>
              <div class="content">
                <h2>Smash the Walls</h2>
                <h3 class="description">
                  Create and share your ideas the way you want, on an open
                  ecosystem of linked and cross-referenced content made of
                  different platforms, rules, and content types.
                </h3>
              </div>
            </div>
            <div class="carousel-item">
              <div class="bkg-illustration right top">${Home21Background}</div>
              <div class="bkg-illustration left bottom">
                ${Home22Background}
              </div>
              <div class="content">
                <h2>Connect with Others</h2>
                <h3 class="description">
                  Build your personal "graph" of ideas. Flexibly decide which
                  portion you want to share, discover other's work, and connect
                  it with yours.
                </h3>
              </div>
            </div>
            <div class="carousel-item">
              <div class="bkg-illustration right bottom">
                ${Home3Background}
              </div>

              <div class="content">
                <h2>Explore A Decentralized World</h2>
                <h3 class="description">
                  Use familiar web-hosting services or leverage emerging
                  decentralized technologies to govern and free your ideas and
                  those of your community.
                </h3>
              </div>
            </div>
            <div class="carousel-item">
              <div class="bkg-illustration right top">${Home4Background}</div>

              <div class="content">
                <h2>Open your Mind</h2>
                <h3 class="description">
                  Connect your content with that of others. Track its origin.
                  Remix it. Branch and evolve it. Make proposals.
                  <br />
                  Embrace the information chaos we now live in, and learn, with
                  us, how to make sense of it. risus.
                </h3>
              </div>
            </div>
          </ui5-carousel>
        </div>
      </div>
    `;
  }

  static get styles() {
    return [
      styles,
      css`
        :host {
          display: flex;
          flex: 1 1 0;
          color: #262641;
        }

        h1 {
          font-weight: 700;
          font-size: calc(2rem + 1vmin);
        }
        a {
          color: #da3e52;
        }
        .loginButton {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          padding: 12px 32px;

          background: #ffffff;
          /* Iris-10 */

          border: 2px solid #efeffd;
          box-sizing: border-box;
          border-radius: 8px;
          min-width: 200px;
          width: 90%;
          max-width: 400px;
          cursor: pointer;
          margin-bottom: 0.7rem;
        }

        .loginButton > svg {
          height: 1.1rem;
          width: 1.1rem;
          padding: 0 0.2rem;
        }

        .loginButton[disabled] {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .root {
          flex-direction: row;
          justify-content: center;
          align-items: center;
          height: 100%;
          width: 100%;
          display: flex;
        }
        .root > * {
          justify-content: center;
          align-items: center;
          display: flex;
          flex: 1;
          height: 100%;
          flex-direction: column;
          position: relative;
        }
        .bkg-illustration {
          position: absolute;
          z-index: 1;
        }
        .top {
          top: 10%;
        }
        .right {
          right: 0;
        }
        .left {
          left: 0;
        }
        .bottom {
          bottom: 0;
        }
        .bkg-img {
          position: absolute;
          z-index: -2;
        }
        .login-card {
          background: #ffffff;
          box-shadow: 0px 50px 100px -8px rgba(14, 14, 44, 0.12);
          border-radius: 10px;
          width: 90%;
          height: 50%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .content {
          text-align: center;
          width: 70%;
          font-weight: 700;
          width: 100%;
        }
        .description {
          color: #5c5c77;
          font-weight: 500;
        }
        .login-cont {
          background-image: url('src/assets/trees.png');
          background-repeat: no-repeat;
          background-size: cover;
          width: 100%;
        }
        .carousel-item {
          position: relative;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 20%;
          background: var(--white, #fff);
        }
        uprtcl-button {
          width: 300px;
          margin: 16px 0px 6px 0px;
        }
        ui5-carousel {
          width: 50vw;
        }

        @media only screen and (max-width: 900px) {
          .root {
            display: block;
          }
          .root > * {
            height: 70%;
          }
          /* .bkg-illustration {
            display: none;
          } */
          ui5-carousel {
            width: 100vw;
          }
        }
      `,
    ];
  }
}
