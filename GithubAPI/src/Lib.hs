{-# LANGUAGE DataKinds            #-}
{-# LANGUAGE DeriveAnyClass       #-}
{-# LANGUAGE DeriveGeneric        #-}
{-# LANGUAGE FlexibleContexts     #-}
{-# LANGUAGE FlexibleInstances    #-}
{-# LANGUAGE OverloadedStrings    #-}
{-# LANGUAGE StandaloneDeriving   #-}
{-# LANGUAGE TemplateHaskell      #-}
{-# LANGUAGE TypeOperators        #-}
{-# LANGUAGE TypeSynonymInstances #-}
{-# LANGUAGE LambdaCase #-}
{-# LANGUAGE DuplicateRecordFields     #-}

module Lib
    ( someFunc
    ) where

import qualified GitHub as GH
import qualified Servant.Client as SC
import           Network.HTTP.Client        (newManager)
import           Network.HTTP.Client.TLS    (tlsManagerSettings)
import           System.Environment         (getArgs)
import           Data.Text hiding           (map,intercalate, groupBy, concat,head)
import           Data.List                  (intercalate, groupBy, sortBy)
import           Data.Either
import           Servant.API                (BasicAuthData (..))
import           Data.ByteString.UTF8       (fromString)

someFunc :: IO ()
someFunc = do
  putStrLn "Attempting to call GitHub"
  (rName:user:token:_) <- getArgs
  putStrLn $ "Github account to retrieve data from is: " ++ rName
  putStrLn $ "Github account that is making API call is: " ++ user
  putStrLn $ "Token associated with this account is: " ++ token

  let auth = BasicAuthData (fromString user) (fromString token)
  
  testGitHubCall auth $ pack rName
  putStrLn "finished"


testGitHubCall :: BasicAuthData -> Text -> IO ()
testGitHubCall auth name = 
  (SC.runClientM (GH.getUser (Just "retrieving GitHub API data") auth name) =<< env) >>= \case

    Left err -> do
      putStrLn $ "WE GOT AN ERROR GETTING PUBLIC DATA :( " ++ show err
    Right res -> do
      putStrLn $ "We got data: " ++ show res
      
      --get user's repos
      (SC.runClientM (GH.getUserRepos (Just "retrieving GitHub API data") auth name) =<< env) >>= \case
        Left err -> do
          putStrLn $ "WE GOT AN ERROR OBTAINING REPO DATA " ++ show err
        Right res' -> do
          putStrLn $ "User's repos are: \n" ++
           intercalate ", \n" (map (\(GH.GitHubRepos a b c d) -> "Repo name: " ++ show a ++ ", \t \t Size " ++ show b ++ ", \t \t Repo URL: " ++ show c ++ ", \t \t Language: " ++ show (letter d)) res')

          -- List all collabarotors linked with the account and their number of contributions
          partitionEithers <$> mapM (getContribs auth name) res' >>= \case

            ([], contribs) ->
              putStrLn $ " contributors are: " ++
              (intercalate "\n\t\t" .
               map (\(GH.RepoContributor n c) -> "[ Contributor: " ++ show n ++ ", \t\tContributions: " ++ show c ++ "]") .
               groupContributors $ concat contribs)

            (err, _)-> do
              putStrLn $ "WE GOT AN ERROR OBTAINING REPO CONTRIBUTER DATA: " ++ show err
                
           
     
  where env :: IO SC.ClientEnv
        env = do
          manager <- newManager tlsManagerSettings
          return $ SC.mkClientEnv manager (SC.BaseUrl SC.Http "api.github.com" 80 "")

        getContribs :: BasicAuthData -> GH.Username -> GH.GitHubRepos -> IO (Either SC.ClientError [GH.RepoContributor])
        getContribs auth name (GH.GitHubRepos repo _ _ _) =
          SC.runClientM (GH.getRepoContribs (Just "retrieving GitHub API data") auth name repo) =<< env

        groupContributors :: [GH.RepoContributor] -> [GH.RepoContributor]
        groupContributors  = sortBy (\(GH.RepoContributor _ c1) (GH.RepoContributor _ c2) ->  compare c1 c2) .
                             map mapfn .
                             groupBy (\(GH.RepoContributor l1 _) (GH.RepoContributor l2 _) ->  l1 == l2)
         where mapfn :: [GH.RepoContributor] -> GH.RepoContributor
               mapfn xs@((GH.RepoContributor l _):_) = GH.RepoContributor l . sum $ 
                                                       map (\(GH.RepoContributor _ c) -> c)  xs

letter :: Maybe Text -> [Text]
letter Nothing = []
letter (Just x) = [x]