FROM mambaorg/micromamba:latest

WORKDIR /app

COPY --chown=$MAMBA_USER:$MAMBA_USER environment.yml /tmp/environment.yml

RUN micromamba create -y -f /tmp/environment.yml
RUN micromamba clean --all --yes

COPY --chown=$MAMBA_USER:$MAMBA_USER . /app

SHELL ["micromamba", "run", "-n", "cragmaster", "/bin/bash", "-c"]

EXPOSE 5757

CMD ["micromamba", "run", "-n", "cragmaster", "python", "app.py"]
