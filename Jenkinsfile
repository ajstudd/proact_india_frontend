pipeline {
    agent any

    environment {
        DOCKERHUB_PASSWORD = ''
        DOCKERHUB_USERNAME = 'ajxdoc'
        FRONTEND_IMAGE = 'proactive_frontend:latest'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: 'github-credentials',
                    url: 'https://github.com/ajstudd/proact_india_frontend.git'
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKERHUB_USERNAME', passwordVariable: 'DOCKERHUB_PASSWORD')]) {
                    sh 'echo "$DOCKERHUB_PASSWORD" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin'
                }
            }
        }

        stage('Create .env File') {
            steps {
                writeFile file: '.env', text: 'NEXT_PUBLIC_API_URL=http://141.148.194.201:8515/api'
            }
        }
        

        stage('Build Docker Image') {
            steps {
                sh '''
                    echo "Building image: $DOCKERHUB_USERNAME/$FRONTEND_IMAGE"
                    docker build -t $DOCKERHUB_USERNAME/$FRONTEND_IMAGE .
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh 'docker push $DOCKERHUB_USERNAME/proactive_frontend:latest'
            }
        }

        stage('Deploy to Oracle Server') {
            steps {
                sshagent(credentials: ['oracle-ssh']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no junaid@141.148.194.201 << EOF
                        docker pull $DOCKERHUB_USERNAME/proactive_frontend:latest
                        docker stop proactive_frontend || true
                        docker rm proactive_frontend || true
                        docker run -d --name proactive_frontend -p 3000:3000 \
                            -e NEXT_PUBLIC_API_URL=http://141.148.194.201:8515/api \
                            $DOCKERHUB_USERNAME/proactive_frontend:latest
                        docker image prune -f
                        EOF
                    '''
                }
            }
        }
    }
}
