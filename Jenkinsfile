pipeline{
    agent any
    stages{
        stage("code clone"){
            steps{
                git url: "https://github.com/syedfaraz1/taskFlowApp-WithDB", branch: "main"
            }
        }
        stage("build the code"){
            steps{
                sh "docker build -t java-taskflow-app ."
            }
        }
        stage("test"){
            steps{
                echo "tester will test the app"
            }
        }
        stage("push image to docker hub"){
            steps{
                withCredentials([usernamePassword(
                    credentialsId: "dockerHubCreds",
                    passwordVariable: "dockerHubPass",
                    usernameVariable: "dockerHubUser")]){
                        sh "docker login -u ${env.dockerHubUser} -p ${env.dockerHubPass}"
                        sh "docker image tag java-taskflow-app ${env.dockerHubUser}/java-taskflow-app"
                        sh "docker push ${env.dockerHubUser}/java-taskflow-app"
                    }
            }
        }
        stage("deploy"){
            steps{
                sh "docker compose up -d --build"
            }
        }
    }
}
