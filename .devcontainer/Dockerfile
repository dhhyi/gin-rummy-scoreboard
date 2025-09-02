FROM ghcr.io/dhhyi/dcc-devcontainer-javascript-pnpm

USER root

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive && apt-get -y install --no-install-recommends openjdk-21-jre-headless tmux && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN mkdir -p "/usr/local/bin" && echo "IyEvYmluL2Jhc2gKamF2YSAtamFyIC9vcHQvc3ZnMnBuZy5qYXIgIiRAIgo=" | base64 -d > "/usr/local/bin/svg2png" && chmod +rx "/usr/local/bin/svg2png"

RUN mkdir -p "/" && echo "CiMhL2Jpbi9iYXNoCmlmIFsgLXogIiQqIiBdOyB0aGVuCiAgdG11eCBuZXctc2Vzc2lvbiAtQSAtcyB0bXV4CmZpCmV4ZWMgc2ggIiRAIgo=" | base64 -d > "/tmux-or-else.sh" && chmod +rx "/tmux-or-else.sh"

RUN wget -qO- https://github.com/sterlp/svg2png/releases/download/v1.2.1/svg2png-1.2.1.jar -O /opt/svg2png.jar

USER ubuntu

RUN pnpm i -g @vue/cli

EXPOSE 8080
