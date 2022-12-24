//
//  Dynamic.swift
//  chatApp
//
//  Created by Rently Coimbatore on 24/12/22.
//

import UIKit
import Foundation
import Lottie

@objc class Dynamic: NSObject {

  @objc func createAnimationView(rootView: UIView, lottieName: String) -> AnimationView {
    let animationView = AnimationView(name: lottieName)
    animationView.frame = rootView.frame
    animationView.center = rootView.center
    animationView.backgroundColor = UIColor.white;
    return animationView;
  }

  @objc func play(animationView: AnimationView) { 
    animationView.play(
      fromProgress: 0.0, toProgress: 1.0, loopMode: LottieLoopMode.loop, completion: { (success) in RNSplashScreen.setAnimationFinished(true) } 
      ); 
    }
}
