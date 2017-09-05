pipeline {
  agent {
    docker {
      args '-u root'
      image 'phpdocker/phpdocker:7.1'
    }
  }
  stages {
    stage('Build') {
      steps {
        sh 'service mysql start'
        sh 'mysql -e "create database flarum;"'
        sh 'composer config -g github-oauth.github.com $GITHUB_TOKEN'
        sh 'composer install --prefer-dist --no-interaction --no-progress'
        sh 'php flarum install --defaults -n'
      }
    }
    stage('Test') {
      steps {
        sh 'php vendor/bin/phpunit'
      }
    }
  }
  environment {
    DB_USERNAME = 'root'
    DB_PASSWORD = ''
    DB_DATABASE = 'flarum'
  }
}