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
import           Data.Text hiding (map,intercalate)
import           Data.List (intercalate)
import           System.Environment         (getArgs)


someFunc :: IO ()
someFunc = do
    putStrLn "Attempting to call GitHub"
    
    (fName:_) <- getArgs
    putStrLn $ "Name from command line is " ++fName
    testGitHubCall $ pack fName

    putStrLn "finished"

testGitHubCall :: Text -> IO ()

testGitHubCall name =
    (SC.runClientM (GH.getUser (Just "retrieving GitHub API data") name) =<< env) >>= \case

        Left err -> do
         putStrLn $ "WE GOT AN ERROR GETTING PUBLIC DATA :( " ++ show err
        Right res -> do
         putStrLn $ "We got data: " ++ show res

         --get user's repos
         (SC.runClientM (GH.getUserRepos (Just "retrieving GitHub API data") name) =<< env) >>= \case
          Left err -> do
           putStrLn $ "WE GOT AN ERROR OBTAINING REPO DATA " ++ show err
          Right res' -> do
           putStrLn $ "User's repos are: \n" ++
            intercalate ", \n" (map (\(GH.GitHubRepos a b c ) ->"Repo name: " ++ show a ++ ", \t \t Stargazer Count: " ++ show b ++ ", \t \t HTML_URL: " ++ show c) res')



    where env :: IO SC.ClientEnv
          env = do
            manager <- newManager tlsManagerSettings
            return $ SC.mkClientEnv manager (SC.BaseUrl SC.Http "api.github.com" 80 "")

--https://hackage.haskell.org/package/base-4.14.1.0/docs/src/Data.Maybe.html#fromJust