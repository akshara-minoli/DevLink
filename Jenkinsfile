pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        skipDefaultCheckout(true)
    }

    environment {
        REGISTRY = 'ghcr.io'
        IMAGE_OWNER = 'akshara-minoli'
        API_IMAGE = 'ghcr.io/akshara-minoli/devlink-api'
        WEB_IMAGE = 'ghcr.io/akshara-minoli/devlink-web'
        K8S_NAMESPACE = 'devlink'
        REPO_URL = 'https://github.com/akshara-minoli/DevLink.git'
    }

    stages {
        stage('Checkout') {
            steps {
                ws('devlink-clean') {
                    git branch: env.BRANCH_NAME ?: 'main', url: env.REPO_URL
                    echo "Building repository: ${env.REPO_URL}"
                }
            }
        }

        stage('CI') {
            stages {
                stage('Verify Docker access') {
                    steps {
                        ws('devlink-clean') {
                            sh '''
                                if [ -n "${DOCKER_HOST:-}" ] && docker info >/dev/null 2>&1; then
                                  printf '%s' "$DOCKER_HOST" > .docker-host
                                  echo "Using configured Docker daemon: $DOCKER_HOST"
                                  docker version
                                  exit 0
                                fi

                                CANDIDATES=""
                                if [ -S /var/run/docker.sock ]; then
                                  CANDIDATES="$CANDIDATES unix:///var/run/docker.sock"
                                fi
                                if [ -S /run/docker.sock ]; then
                                  CANDIDATES="$CANDIDATES unix:///run/docker.sock"
                                fi
                                CANDIDATES="$CANDIDATES tcp://localhost:2375 tcp://host.docker.internal:2375"

                                RESOLVED_DOCKER_HOST=""
                                for candidate in $CANDIDATES; do
                                  if env -u DOCKER_TLS_VERIFY -u DOCKER_CERT_PATH -u DOCKER_TLS_CERTDIR \
                                    DOCKER_HOST="$candidate" docker info >/dev/null 2>&1; then
                                    RESOLVED_DOCKER_HOST="$candidate"
                                    break
                                  fi
                                done

                                if [ -z "$RESOLVED_DOCKER_HOST" ]; then
                                  echo "No reachable Docker daemon found."
                                  echo "Configured DOCKER_HOST: ${DOCKER_HOST:-not set}"
                                  echo "Fallbacks tried:$CANDIDATES"
                                  echo "For tcp://docker:2376, mount the Docker client certificates and set DOCKER_TLS_VERIFY=1 and DOCKER_CERT_PATH=/certs/client."
                                  echo "Alternatively, mount /var/run/docker.sock into the Jenkins agent."
                                  rm -f .docker-host
                                  exit 1
                                fi

                                printf '%s' "$RESOLVED_DOCKER_HOST" > .docker-host
                                export DOCKER_HOST="$RESOLVED_DOCKER_HOST"
                                echo "Using DOCKER_HOST=$DOCKER_HOST"
                                docker version
                                docker run --rm hello-world
                            '''
                        }
                    }
                }

                stage('Install dependencies') {
                    steps {
                        ws('devlink-clean') {
                            sh '''
                                if [ ! -f .docker-host ]; then
                                  echo "Docker availability was not verified."
                                  exit 1
                                fi
                                if [ -f .docker-host ]; then
                                  export DOCKER_HOST="$(cat .docker-host)"
                                fi
                                docker run --rm \
                                  --user "$(id -u):$(id -g)" \
                                  --volumes-from "$HOSTNAME" \
                                  -w "$PWD" \
                                  node:20-alpine sh -lc "npm ci \
                                    --cache /var/jenkins_home/.npm-cache \
                                    --fetch-retries=5 \
                                    --fetch-retry-mintimeout=20000 \
                                    --fetch-retry-maxtimeout=120000"
                            '''
                        }
                    }
                }

                stage('Build frontend') {
                    steps {
                        ws('devlink-clean') {
                            sh '''
                                if [ ! -f .docker-host ]; then
                                  echo "Docker availability was not verified."
                                  exit 1
                                fi
                                if [ -f .docker-host ]; then
                                  export DOCKER_HOST="$(cat .docker-host)"
                                fi
                                docker run --rm \
                                  --user "$(id -u):$(id -g)" \
                                  --volumes-from "$HOSTNAME" \
                                  -w "$PWD" \
                                  -e VITE_API_URL=/api \
                                  node:20-alpine sh -lc "npm run build --workspace frontend"
                            '''
                        }
                    }
                }

                stage('Verify backend app load') {
                    steps {
                        ws('devlink-clean') {
                            sh '''
                                if [ ! -f .docker-host ]; then
                                  echo "Docker availability was not verified."
                                  exit 1
                                fi
                                if [ -f .docker-host ]; then
                                  export DOCKER_HOST="$(cat .docker-host)"
                                fi
                                docker run --rm \
                                  --user "$(id -u):$(id -g)" \
                                  --volumes-from "$HOSTNAME" \
                                  -w "$PWD" \
                                  node:20-alpine sh -lc "node -e \\"import('./backend/src/app.js').then(() => console.log('Backend app loaded successfully'))\\""
                            '''
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                ws('devlink-clean') {
                    sh '''
                        if [ ! -f .docker-host ]; then
                          echo "Docker availability was not verified."
                          exit 1
                        fi
                        if [ -f .docker-host ]; then
                          export DOCKER_HOST="$(cat .docker-host)"
                        fi
                        IMAGE_TAG=$(git rev-parse --short=12 HEAD)
                        docker build -t ${API_IMAGE}:$IMAGE_TAG -f backend/Dockerfile .
                        docker build --build-arg VITE_API_URL=/api -t ${WEB_IMAGE}:$IMAGE_TAG -f frontend/Dockerfile .
                    '''
                }
            }
        }

        stage('Push Docker Images') {
            when {
                expression { env.BRANCH_NAME in ['main', 'master'] || env.GIT_BRANCH in ['main', 'master', 'origin/main', 'origin/master'] }
            }
            steps {
                withCredentials([string(credentialsId: 'ghcr-token', variable: 'GHCR_TOKEN')]) {
                    ws('devlink-clean') {
                        sh '''
                            if [ ! -f .docker-host ]; then
                              echo "Docker availability was not verified."
                              exit 1
                            fi
                            if [ -f .docker-host ]; then
                              export DOCKER_HOST="$(cat .docker-host)"
                            fi
                            IMAGE_TAG=$(git rev-parse --short=12 HEAD)
                            echo "$GHCR_TOKEN" | docker login ${REGISTRY} -u ${IMAGE_OWNER} --password-stdin
                            docker tag ${API_IMAGE}:$IMAGE_TAG ${API_IMAGE}:latest
                            docker tag ${WEB_IMAGE}:$IMAGE_TAG ${WEB_IMAGE}:latest
                            docker push ${API_IMAGE}:$IMAGE_TAG
                            docker push ${API_IMAGE}:latest
                            docker push ${WEB_IMAGE}:$IMAGE_TAG
                            docker push ${WEB_IMAGE}:latest
                        '''
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            when {
                expression { env.BRANCH_NAME in ['main', 'master'] || env.GIT_BRANCH in ['main', 'master', 'origin/main', 'origin/master'] }
            }
            steps {
                withCredentials([
                    file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG_FILE'),
                    string(credentialsId: 'devlink-postgres-password', variable: 'POSTGRES_PASSWORD'),
                    string(credentialsId: 'devlink-jwt-secret', variable: 'JWT_SECRET'),
                    string(credentialsId: 'devlink-client-origin', variable: 'CLIENT_ORIGIN')
                ]) {
                    ws('devlink-clean') {
                        sh '''
                            export KUBECONFIG="$KUBECONFIG_FILE"
                            kubectl create namespace ${K8S_NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -
                            kubectl -n ${K8S_NAMESPACE} create secret generic devlink-secrets \
                              --from-literal=POSTGRES_PASSWORD="$POSTGRES_PASSWORD" \
                              --from-literal=DATABASE_URL="postgresql://devlink:${POSTGRES_PASSWORD}@devlink-postgres:5432/devlink" \
                              --from-literal=JWT_SECRET="$JWT_SECRET" \
                              --from-literal=CLIENT_ORIGIN="$CLIENT_ORIGIN" \
                              --dry-run=client -o yaml | kubectl apply -f -
                            kubectl apply -k k8s/base
                            kubectl -n ${K8S_NAMESPACE} rollout status deployment/devlink-api --timeout=180s
                            kubectl -n ${K8S_NAMESPACE} rollout status deployment/devlink-web --timeout=180s
                        '''
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                if (env.WORKSPACE) {
                    deleteDir()
                }
            }
        }
    }
}
