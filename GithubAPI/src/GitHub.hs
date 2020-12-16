{-# LANGUAGE DataKinds         #-}
{-# LANGUAGE DeriveAnyClass    #-}
{-# LANGUAGE DeriveGeneric     #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeOperators     #-}
{-# LANGUAGE DuplicateRecordFields     #-}


module GitHub where 

import           Control.Monad       (mzero)
import           Data.Aeson
import           Data.Proxy
import           Data.Text
import           GHC.Generics
import           Network.HTTP.Client (defaultManagerSettings, newManager)
import           Servant.API
import           Servant.Client

type Username = Text
type UserAgent = Text

data GitHubUser =
    GitHubUser { login :: Text ,
                 name :: Maybe Text,
                 company :: Maybe Text,
                 email :: Maybe Text
                 } 
                 deriving (Generic, FromJSON, Show)

data GitHubRepos =
    GitHubRepos {full_name :: Text,
                 stargazers_count :: Integer,
                 html_url :: Text
                 }
                 deriving (Generic, FromJSON, Show)

type GitHubAPI = "users" :> Header "user-agent" UserAgent
                         :> Capture "username" Username :> Get '[JSON] GitHubUser
            :<|> "users" :> Header "user-agent" UserAgent
                         :> Capture "username" Username :> "repos" :> Get '[JSON] [GitHubRepos]

gitHubAPI :: Proxy GitHubAPI
gitHubAPI = Proxy

getUser :: Maybe UserAgent -> Username -> ClientM GitHubUser
getUserRepos ::Maybe UserAgent -> Username -> ClientM [GitHubRepos]

getUser :<|> getUserRepos = client gitHubAPI